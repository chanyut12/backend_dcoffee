import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { InventoryItem } from '../inventory-items/entities/inventory-item.entity';
import { UsageDetail } from '../usage-detail/entities/usage-detail.entity';
import { UsageRecord } from '../usage-record/entities/usage-record.entity';

// Define interfaces for our data structures
export interface ItemUsage {
  id: string;
  name: string;
  totalUsage: number;
  unit: string;
}

export interface MonthlyUsageData {
  month: number;
  monthName: string;
  totalUsage: number;
}

export interface DailyUsageData {
  day: number;
  date: string;
  totalUsage: number;
}

export interface InventoryReportItem {
  id: string | number;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  minStock: number;
  status: 'warning' | 'normal';
  supplier: string;
  lastOrder: Date | string | null;
}

export interface MonthlyInventoryReport {
  year: number;
  month: number;
  monthName: string;
  items: InventoryReportItem[];
}

export interface MonthlyUsageReport {
  year: number;
  month: number;
  monthName: string;
  totalUsage: number;
  recordCount: number;
  items: ItemUsage[];
}

export interface UsageChartData {
  year: number;
  data: MonthlyUsageData[];
}

export interface CategoryUsageData {
  category: string;
  totalUsage: number;
}

export interface DetailedUsageChartData {
  type: 'monthly' | 'yearly' | 'category' | 'item';
  year: number;
  month?: number;
  data: any[]; // Using any[] instead of union type to fix type errors
}

@Injectable()
export class InventoryReportService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(UsageDetail)
    private usageDetailRepository: Repository<UsageDetail>,
    @InjectRepository(UsageRecord)
    private usageRecordRepository: Repository<UsageRecord>,
  ) {}

  async getMonthlyReport(
    year?: number,
    month?: number,
  ): Promise<MonthlyInventoryReport> {
    // ตั้งค่าปีและเดือนปัจจุบันถ้าไม่ระบุ
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || currentDate.getMonth() + 1;

    // ดึงข้อมูลวัตถุดิบทั้งหมดพร้อมกับสถานะ (ปกติ/ใกล้หมด)
    const inventoryItems = await this.inventoryItemRepository.find({
      relations: ['category'],
    });

    return {
      year: reportYear,
      month: reportMonth,
      monthName: new Date(reportYear, reportMonth - 1, 1).toLocaleString(
        'default',
        { month: 'long' },
      ),
      items: inventoryItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category ? item.category.name : null,
        quantity: item.quantity,
        unit: item.unit,
        minStock: item.minStock,
        status: item.quantity <= item.minStock ? 'warning' : 'normal',
        supplier: item.supplier,
        lastOrder: item.lastOrder,
      })),
    };
  }

  async getMonthlyUsageReport(
    year?: number,
    month?: number,
  ): Promise<MonthlyUsageReport> {
    // ตั้งค่าปีและเดือนปัจจุบันถ้าไม่ระบุ
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || currentDate.getMonth() + 1;

    // สร้างช่วงวันที่สำหรับการกรอง
    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999);

    // ค้นหาบันทึกการใช้ในเดือนที่ระบุ
    const usageRecords = await this.usageRecordRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['details', 'details.inventoryItem'],
    });

    // รวมยอดการใช้ตามรายการวัตถุดิบ
    const itemUsageMap = new Map<string, ItemUsage>();

    usageRecords.forEach((record) => {
      record.details.forEach((detail) => {
        const itemId = detail.inventoryItem
          ? String(detail.inventoryItem.id)
          : 'unknown';
        const itemName = detail.productName;

        if (!itemUsageMap.has(itemId)) {
          itemUsageMap.set(itemId, {
            id: itemId,
            name: itemName,
            totalUsage: 0,
            unit: detail.unit,
          });
        }

        const itemUsage = itemUsageMap.get(itemId);
        if (itemUsage) {
          itemUsage.totalUsage += detail.quantityUsed;
        }
      });
    });

    // ข้อมูลสรุป
    const totalUsage = usageRecords.reduce(
      (sum, record) => sum + record.totalUsage,
      0,
    );

    return {
      year: reportYear,
      month: reportMonth,
      monthName: new Date(reportYear, reportMonth - 1, 1).toLocaleString(
        'default',
        { month: 'long' },
      ),
      totalUsage,
      recordCount: usageRecords.length,
      items: Array.from(itemUsageMap.values()),
    };
  }

  async getUsageChartData(year?: number): Promise<UsageChartData> {
    const currentYear = new Date().getFullYear();
    const reportYear = year || currentYear;

    // สร้างข้อมูลสำหรับทั้ง 12 เดือน
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const result: MonthlyUsageData[] = [];

    for (const month of months) {
      const startDate = new Date(reportYear, month - 1, 1);
      const endDate = new Date(reportYear, month, 0, 23, 59, 59, 999);

      // ค้นหาบันทึกการใช้ในเดือนนั้น
      const usageRecords = await this.usageRecordRepository.find({
        where: {
          date: Between(startDate, endDate),
        },
        relations: ['details'],
      });

      // คำนวณยอดรวมการใช้
      const totalUsage = usageRecords.reduce((sum, record) => {
        return sum + (record.totalUsage || 0);
      }, 0);

      // เพิ่มข้อมูลเดือนพร้อมยอดรวม
      result.push({
        month: month,
        monthName: new Date(reportYear, month - 1, 1).toLocaleString(
          'default',
          { month: 'long' },
        ),
        totalUsage: totalUsage,
      });
    }

    return {
      year: reportYear,
      data: result,
    };
  }

  async getDetailedUsageChartData(
    year?: number,
    month?: number,
    chartType: 'monthly' | 'yearly' | 'category' | 'item' = 'monthly',
  ): Promise<DetailedUsageChartData> {
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || currentDate.getMonth() + 1;

    // Determine date range based on chart type
    let startDate: Date;
    let endDate: Date;

    if (chartType === 'yearly') {
      startDate = new Date(reportYear, 0, 1);
      endDate = new Date(reportYear, 11, 31, 23, 59, 59, 999);
    } else {
      startDate = new Date(reportYear, reportMonth - 1, 1);
      endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999);
    }

    // Get usage records for the specified period
    const usageRecords = await this.usageRecordRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: [
        'details',
        'details.inventoryItem',
        'details.inventoryItem.category',
      ],
    });

    if (chartType === 'monthly') {
      // Monthly data - usage by day in the selected month
      const dailyData: DailyUsageData[] = [];
      const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(reportYear, reportMonth - 1, day);
        const dayStr = date.toISOString().split('T')[0];

        const dayRecords = usageRecords.filter(
          (record) => new Date(record.date).getDate() === day,
        );

        const dayUsage = dayRecords.reduce(
          (sum, record) => sum + record.totalUsage,
          0,
        );

        dailyData.push({
          day,
          date: dayStr,
          totalUsage: dayUsage,
        });
      }

      return {
        type: 'monthly',
        year: reportYear,
        month: reportMonth,
        data: dailyData,
      };
    } else if (chartType === 'yearly') {
      // Yearly data - aggregated by month
      const monthlyData: MonthlyUsageData[] = [];

      for (let month = 1; month <= 12; month++) {
        const monthName = new Date(reportYear, month - 1, 1).toLocaleString(
          'default',
          { month: 'long' },
        );

        const monthRecords = usageRecords.filter(
          (record) => new Date(record.date).getMonth() + 1 === month,
        );

        const totalUsage = monthRecords.reduce(
          (sum, record) => sum + record.totalUsage,
          0,
        );

        monthlyData.push({
          month,
          monthName,
          totalUsage,
        });
      }

      return {
        type: 'yearly',
        year: reportYear,
        data: monthlyData,
      };
    } else if (chartType === 'category') {
      // Category data - aggregated by item category
      const categoryMap = new Map<string, CategoryUsageData>();

      usageRecords.forEach((record) => {
        record.details.forEach((detail) => {
          if (detail.inventoryItem?.category) {
            const categoryName = detail.inventoryItem.category.name;

            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, {
                category: categoryName,
                totalUsage: 0,
              });
            }

            const categoryData = categoryMap.get(categoryName);
            if (categoryData) {
              categoryData.totalUsage += detail.quantityUsed;
            }
          }
        });
      });

      return {
        type: 'category',
        year: reportYear,
        month: reportMonth,
        data: Array.from(categoryMap.values()).sort(
          (a, b) => b.totalUsage - a.totalUsage,
        ),
      };
    } else {
      // Item data - top used items
      const itemMap = new Map<string, ItemUsage>();

      usageRecords.forEach((record) => {
        record.details.forEach((detail) => {
          const itemId = detail.inventoryItem
            ? String(detail.inventoryItem.id)
            : 'unknown';
          const itemName = detail.productName;

          if (!itemMap.has(itemId)) {
            itemMap.set(itemId, {
              id: itemId,
              name: itemName,
              totalUsage: 0,
              unit: detail.unit,
            });
          }

          const itemData = itemMap.get(itemId);
          if (itemData) {
            itemData.totalUsage += detail.quantityUsed;
          }
        });
      });

      return {
        type: 'item',
        year: reportYear,
        month: reportMonth,
        data: Array.from(itemMap.values())
          .sort((a, b) => b.totalUsage - a.totalUsage)
          .slice(0, 10), // Top 10 items
      };
    }
  }
}
