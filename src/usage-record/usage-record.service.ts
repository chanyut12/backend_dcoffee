import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';
import { UsageRecord } from './entities/usage-record.entity';
import { UsageDetail } from 'src/usage-detail/entities/usage-detail.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { UsageDetailService } from 'src/usage-detail/usage-detail.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsageRecordService {
  constructor(
    @InjectRepository(UsageRecord)
    private usageRecordRepository: Repository<UsageRecord>,
    @InjectRepository(UsageDetail)
    private usageDetailRepository: Repository<UsageDetail>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usageDetailService: UsageDetailService,
    private dataSource: DataSource,
  ) {}

  async create(
    createUsageRecordDto: CreateUsageRecordDto,
  ): Promise<UsageRecord> {
    // สร้าง queryRunner สำหรับทำ transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { details, userId, ...recordData } = createUsageRecordDto;

      // Create usage record
      const usageRecord = this.usageRecordRepository.create({
        ...recordData,
        date: new Date(),
      });

      // Associate with user if userId is provided
      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        usageRecord.userId = userId;
      }

      const savedRecord = await queryRunner.manager.save(usageRecord);

      // Process each usage detail
      if (details && details.length > 0) {
        const usageDetails: UsageDetail[] = [];

        for (const detailDto of details) {
          // Validate inventoryItemId (เพิ่มการตรวจสอบว่าต้องมี inventoryItemId)
          if (!detailDto.inventoryItemId) {
            throw new BadRequestException(
              'Inventory item ID is required for usage detail',
            );
          }

          // Validate quantityUsed
          if (!detailDto.quantityUsed || detailDto.quantityUsed <= 0) {
            throw new BadRequestException(
              'Quantity used must be greater than 0',
            );
          }

          // Create usage detail
          const usageDetail = this.usageDetailRepository.create(detailDto);

          // Associate with usage record
          usageDetail.usageRecord = savedRecord;

          // Update inventory item quantity
          if (detailDto.inventoryItemId) {
            const inventoryItem = await this.inventoryItemRepository.findOne({
              where: { id: detailDto.inventoryItemId },
            });

            if (!inventoryItem) {
              throw new NotFoundException(
                `Inventory item with ID ${detailDto.inventoryItemId} not found`,
              );
            }

            // Check if productName matches inventory item's name
            if (
              detailDto.productName &&
              detailDto.productName !== inventoryItem.name
            ) {
              throw new BadRequestException(
                `Product name "${detailDto.productName}" does not match inventory item's name "${inventoryItem.name}"`,
              );
            }

            // Check if unit matches inventory item's unit
            if (detailDto.unit && detailDto.unit !== inventoryItem.unit) {
              throw new BadRequestException(
                `Unit "${detailDto.unit}" does not match inventory item's unit "${inventoryItem.unit}"`,
              );
            }

            // Set product name and unit to ensure they match with inventory item
            usageDetail.productName = inventoryItem.name;
            usageDetail.unit = inventoryItem.unit;
            usageDetail.inventoryItem = inventoryItem;

            // Check if there's enough quantity
            if (inventoryItem.quantity < detailDto.quantityUsed) {
              throw new BadRequestException(
                `Not enough quantity for item ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${detailDto.quantityUsed}`,
              );
            }

            // Reduce inventory quantity by amount used
            inventoryItem.quantity -= detailDto.quantityUsed;
            await queryRunner.manager.save(inventoryItem);
          }

          await queryRunner.manager.save(usageDetail);
          usageDetails.push(usageDetail);
        }

        savedRecord.details = usageDetails;
        savedRecord.calculateTotalUsage();
        await queryRunner.manager.save(savedRecord);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedRecord.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.usageRecordRepository.find({
      relations: ['details', 'details.inventoryItem'],
    });
  }

  async findOne(id: number) {
    const usageRecord = await this.usageRecordRepository.findOne({
      where: { id },
      relations: ['details', 'details.inventoryItem'],
    });

    if (!usageRecord) {
      throw new NotFoundException(`Usage record with ID ${id} not found`);
    }

    return usageRecord;
  }

  async update(id: number, updateUsageRecordDto: UpdateUsageRecordDto) {
    // สร้าง queryRunner สำหรับทำ transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usageRecord = await this.findOne(id);
      const { details, userId, ...recordData } = updateUsageRecordDto;

      // Update basic record data
      Object.assign(usageRecord, recordData);

      // Update user association if userId is provided
      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        usageRecord.userId = userId;
      }

      await queryRunner.manager.save(usageRecord);

      // Update details if provided
      if (details && details.length > 0) {
        // เก็บรายการเดิมเพื่อคืนจำนวนสินค้า
        const oldDetails = [...usageRecord.details];

        // ลบรายการเดิมทั้งหมด
        for (const detail of oldDetails) {
          await queryRunner.manager.remove(detail);
        }

        // คืนจำนวนสินค้าเดิม
        const updatedInventoryItems = new Map<number, InventoryItem>();

        for (const detail of oldDetails) {
          if (detail.inventoryItem) {
            const inventoryItemId = detail.inventoryItem.id;
            let inventoryItem: InventoryItem;

            if (updatedInventoryItems.has(inventoryItemId)) {
              inventoryItem = updatedInventoryItems.get(inventoryItemId)!;
            } else {
              const foundItem = await this.inventoryItemRepository.findOne({
                where: { id: inventoryItemId },
              });

              if (!foundItem) {
                continue;
              }

              inventoryItem = foundItem;
            }

            // คืนจำนวนสินค้าเดิม
            inventoryItem.quantity += detail.quantityUsed;
            await queryRunner.manager.save(inventoryItem);
            updatedInventoryItems.set(inventoryItemId, inventoryItem);
          }
        }

        // ตรวจสอบว่าสินค้ามีจำนวนพอสำหรับการใช้ใหม่หรือไม่
        for (const detailDto of details) {
          if (detailDto.inventoryItemId) {
            let inventoryItem: InventoryItem;

            if (updatedInventoryItems.has(detailDto.inventoryItemId)) {
              inventoryItem = updatedInventoryItems.get(
                detailDto.inventoryItemId,
              )!;
            } else {
              const foundItem = await this.inventoryItemRepository.findOne({
                where: { id: detailDto.inventoryItemId },
              });

              if (!foundItem) {
                throw new NotFoundException(
                  `Inventory item with ID ${detailDto.inventoryItemId} not found`,
                );
              }

              inventoryItem = foundItem;
            }

            // ตรวจสอบว่ามีจำนวนพอให้ใช้หรือไม่
            if (
              detailDto.quantityUsed !== undefined &&
              inventoryItem.quantity < detailDto.quantityUsed
            ) {
              throw new BadRequestException(
                `Not enough quantity for item ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${detailDto.quantityUsed}`,
              );
            }
          }
        }

        // สร้างรายการใหม่
        const newDetails: UsageDetail[] = [];

        for (const detailDto of details) {
          // Validate inventoryItemId (เพิ่มการตรวจสอบว่าต้องมี inventoryItemId)
          if (!detailDto.inventoryItemId) {
            throw new BadRequestException(
              'Inventory item ID is required for usage detail',
            );
          }

          // Validate quantityUsed
          if (!detailDto.quantityUsed || detailDto.quantityUsed <= 0) {
            throw new BadRequestException(
              'Quantity used must be greater than 0',
            );
          }

          // สร้างรายการ
          const usageDetail = this.usageDetailRepository.create(detailDto);

          // เชื่อมโยงกับ usage record
          usageDetail.usageRecord = usageRecord;

          // ถ้ามี inventoryItemId ให้เชื่อมโยงกับ inventory item
          if (detailDto.inventoryItemId) {
            let inventoryItem: InventoryItem;

            if (updatedInventoryItems.has(detailDto.inventoryItemId)) {
              inventoryItem = updatedInventoryItems.get(
                detailDto.inventoryItemId,
              )!;
            } else {
              const foundItem = await this.inventoryItemRepository.findOne({
                where: { id: detailDto.inventoryItemId },
              });

              if (!foundItem) {
                throw new NotFoundException(
                  `Inventory item with ID ${detailDto.inventoryItemId} not found`,
                );
              }

              inventoryItem = foundItem;
              updatedInventoryItems.set(
                detailDto.inventoryItemId,
                inventoryItem,
              );
            }

            // Check if productName matches inventory item's name
            if (
              detailDto.productName &&
              detailDto.productName !== inventoryItem.name
            ) {
              throw new BadRequestException(
                `Product name "${detailDto.productName}" does not match inventory item's name "${inventoryItem.name}"`,
              );
            }

            // Check if unit matches inventory item's unit
            if (detailDto.unit && detailDto.unit !== inventoryItem.unit) {
              throw new BadRequestException(
                `Unit "${detailDto.unit}" does not match inventory item's unit "${inventoryItem.unit}"`,
              );
            }

            usageDetail.inventoryItem = inventoryItem;
            usageDetail.productName = inventoryItem.name;
            usageDetail.unit = inventoryItem.unit;

            // ลดจำนวนสินค้า
            inventoryItem.quantity -= detailDto.quantityUsed;
            await queryRunner.manager.save(inventoryItem);
            updatedInventoryItems.set(inventoryItem.id, inventoryItem);
          }

          // บันทึกรายการ
          const savedDetail = await queryRunner.manager.save(usageDetail);
          newDetails.push(savedDetail);
        }

        // อัปเดตรายการใน usage record
        usageRecord.details = newDetails;
      }

      // คำนวณยอดรวม
      usageRecord.calculateTotalUsage();
      await queryRunner.manager.save(usageRecord);

      await queryRunner.commitTransaction();
      return this.findOne(usageRecord.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    // สร้าง queryRunner สำหรับทำ transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usageRecord = await this.findOne(id);
      const updatedInventoryItems = new Map<number, InventoryItem>();

      // Restore inventory quantities
      for (const detail of usageRecord.details) {
        if (detail.inventoryItem) {
          const inventoryItemId = detail.inventoryItem.id;
          let inventoryItem: InventoryItem;

          // ใช้ inventoryItem ที่อัพเดตแล้วถ้ามี
          if (updatedInventoryItems.has(inventoryItemId)) {
            inventoryItem = updatedInventoryItems.get(inventoryItemId)!;
          } else {
            const foundItem = await this.inventoryItemRepository.findOne({
              where: { id: inventoryItemId },
            });

            if (!foundItem) {
              continue;
            }

            inventoryItem = foundItem;
          }

          // Add back the previously deducted quantity
          inventoryItem.quantity += detail.quantityUsed;
          await queryRunner.manager.save(inventoryItem);

          // เก็บข้อมูลสินค้าที่อัพเดตแล้ว
          updatedInventoryItems.set(inventoryItemId, inventoryItem);
        }
      }

      // ลบ record
      const removedRecord = await queryRunner.manager.remove(usageRecord);

      await queryRunner.commitTransaction();
      return removedRecord;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
