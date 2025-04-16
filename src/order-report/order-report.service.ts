import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OrderRecord } from '../order-record/entities/order-record.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';

// Define interfaces for data structures
export interface DailyOrderData {
  date: string;
  orderCount: number;
  totalAmount: number;
}

export interface MonthlyOrderData {
  month: number;
  monthName: string;
  orderCount: number;
  totalAmount: number;
  orders: OrderRecord[];
}

export interface ProductData {
  name: string;
  quantity: number;
  total: number;
}

export interface StatusData {
  status: string;
  count: number;
  total: number;
}

export interface DailyReport {
  date: string;
  orders: OrderRecord[];
  orderCount: number;
  totalAmount: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  monthName: string;
  totalAmount: number;
  orderCount: number;
  dailyData: DailyOrderData[];
  orders: OrderRecord[];
}

export interface YearlyReport {
  year: number;
  totalAmount: number;
  orderCount: number;
  monthlyData: MonthlyOrderData[];
}

export interface MonthlyChartData {
  type: 'monthly';
  year: number;
  data: {
    month: number;
    monthName: string;
    totalAmount: number;
    orderCount: number;
  }[];
}

export interface ProductChartData {
  type: 'product';
  year: number;
  data: ProductData[];
}

export interface StatusChartData {
  type: 'status';
  year: number;
  data: StatusData[];
}

export type ChartData = MonthlyChartData | ProductChartData | StatusChartData;

export interface GraphData {
  format: 'graph';
  chartType: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
  }[];
}

export type FormattedChartData = ChartData | GraphData;

export interface DailyOrderChartData {
  day: number;
  date: string;
  orderCount: number;
  totalAmount: number;
}

export interface DailyChartSummary {
  year: number;
  month: number;
  monthName: string;
  data: DailyOrderChartData[];
}

export type DailyChartData = DailyChartSummary | GraphData;

@Injectable()
export class OrderReportService {
  constructor(
    @InjectRepository(OrderRecord)
    private orderRecordRepository: Repository<OrderRecord>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async getDailyReport(date: Date): Promise<DailyReport> {
    // สร้างช่วงวันที่สำหรับการกรอง (00:00:00 - 23:59:59)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ค้นหาคำสั่งซื้อในวันที่ระบุ
    const orders = await this.orderRecordRepository.find({
      where: {
        orderDate: Between(startOfDay, endOfDay),
      },
      relations: ['details', 'details.inventoryItem'],
      order: {
        orderDate: 'DESC',
      },
    });

    // รวมยอดการสั่งซื้อ
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    const orderCount = orders.length;

    return {
      date: date.toISOString().split('T')[0],
      orders,
      orderCount,
      totalAmount,
    };
  }

  async getMonthlyReport(
    year?: number,
    month?: number,
  ): Promise<MonthlyReport> {
    // ตั้งค่าปีและเดือนปัจจุบันถ้าไม่ระบุ
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || currentDate.getMonth() + 1;

    // สร้างช่วงวันที่สำหรับการกรอง
    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999);

    // ค้นหาคำสั่งซื้อในเดือนที่ระบุ
    const orders = await this.orderRecordRepository.find({
      where: {
        orderDate: Between(startDate, endDate),
      },
      relations: ['details', 'details.inventoryItem'],
      order: {
        orderDate: 'DESC',
      },
    });

    // จัดกลุ่มคำสั่งซื้อตามวัน
    const dailyOrders = new Map<string, DailyOrderData>();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];

      if (!dailyOrders.has(orderDate)) {
        dailyOrders.set(orderDate, {
          date: orderDate,
          orderCount: 0,
          totalAmount: 0,
        });
      }

      const dailyData = dailyOrders.get(orderDate);
      if (dailyData) {
        dailyData.orderCount += 1;
        dailyData.totalAmount += order.totalAmount;
      }
    });

    // คำนวณยอดรวมทั้งเดือน
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    const orderCount = orders.length;

    return {
      year: reportYear,
      month: reportMonth,
      monthName: startDate.toLocaleString('default', { month: 'long' }),
      totalAmount,
      orderCount,
      dailyData: Array.from(dailyOrders.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      orders,
    };
  }

  async getYearlyReport(year?: number): Promise<YearlyReport> {
    // ตั้งค่าปีปัจจุบันถ้าไม่ระบุ
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();

    // สร้างช่วงวันที่สำหรับการกรอง
    const startDate = new Date(reportYear, 0, 1);
    const endDate = new Date(reportYear, 11, 31, 23, 59, 59, 999);

    // ค้นหาคำสั่งซื้อในปีที่ระบุ
    const orders = await this.orderRecordRepository.find({
      where: {
        orderDate: Between(startDate, endDate),
      },
      relations: ['details'],
    });

    // จัดกลุ่มคำสั่งซื้อตามเดือน
    const monthlyOrders = new Map<number, MonthlyOrderData>();

    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(reportYear, month - 1, 1).toLocaleString(
        'default',
        { month: 'long' },
      );

      monthlyOrders.set(month, {
        month: month,
        monthName: monthName,
        orderCount: 0,
        totalAmount: 0,
        orders: [],
      });
    }

    orders.forEach((order) => {
      const orderMonth = new Date(order.orderDate).getMonth() + 1;

      const monthData = monthlyOrders.get(orderMonth);
      if (monthData) {
        monthData.orderCount += 1;
        monthData.totalAmount += order.totalAmount;
        monthData.orders.push(order);
      }
    });

    // คำนวณยอดรวมทั้งปี
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    const orderCount = orders.length;

    return {
      year: reportYear,
      totalAmount,
      orderCount,
      monthlyData: Array.from(monthlyOrders.values()),
    };
  }

  async getChartData(
    year?: number,
    chartType: 'monthly' | 'product' | 'status' = 'monthly',
    format: 'summary' | 'graph' = 'summary',
  ): Promise<FormattedChartData> {
    const currentYear = new Date().getFullYear();
    const reportYear = year || currentYear;

    // สร้างช่วงวันที่สำหรับการกรอง
    const startDate = new Date(reportYear, 0, 1);
    const endDate = new Date(reportYear, 11, 31, 23, 59, 59, 999);

    // ค้นหาคำสั่งซื้อในปีที่ระบุ
    const orders = await this.orderRecordRepository.find({
      where: {
        orderDate: Between(startDate, endDate),
      },
      relations: ['details', 'details.inventoryItem'],
    });

    // Get the data in the standard format first
    let standardData: ChartData;

    if (chartType === 'monthly') {
      // ข้อมูลรายเดือน
      const monthlyData: {
        month: number;
        monthName: string;
        totalAmount: number;
        orderCount: number;
      }[] = [];

      for (let month = 1; month <= 12; month++) {
        const monthName = new Date(reportYear, month - 1, 1).toLocaleString(
          'default',
          { month: 'long' },
        );
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() + 1 === month;
        });

        const totalAmount = monthOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0,
        );
        const orderCount = monthOrders.length;

        monthlyData.push({
          month,
          monthName,
          totalAmount,
          orderCount,
        });
      }

      standardData = {
        type: 'monthly',
        year: reportYear,
        data: monthlyData,
      };
    } else if (chartType === 'product') {
      // ข้อมูลตามสินค้า
      const productMap = new Map<string, ProductData>();

      orders.forEach((order) => {
        order.details.forEach((detail) => {
          const productName = detail.name;

          if (!productMap.has(productName)) {
            productMap.set(productName, {
              name: productName,
              quantity: 0,
              total: 0,
            });
          }

          const productData = productMap.get(productName);
          if (productData) {
            productData.quantity += detail.quantity;
            productData.total += detail.total;
          }
        });
      });

      standardData = {
        type: 'product',
        year: reportYear,
        data: Array.from(productMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 10), // แสดง 10 อันดับแรก
      };
    } else {
      // ข้อมูลตามสถานะ
      const statusMap = new Map<string, StatusData>([
        ['pending', { status: 'pending', count: 0, total: 0 }],
        ['delivered', { status: 'delivered', count: 0, total: 0 }],
        ['cancelled', { status: 'cancelled', count: 0, total: 0 }],
      ]);

      orders.forEach((order) => {
        const status = order.status;
        if (statusMap.has(status)) {
          const statusData = statusMap.get(status);
          if (statusData) {
            statusData.count += 1;
            statusData.total += order.totalAmount;
          }
        }
      });

      standardData = {
        type: 'status',
        year: reportYear,
        data: Array.from(statusMap.values()),
      };
    }

    // Return standard data if format is summary
    if (format === 'summary') {
      return standardData;
    }

    // Convert to graph format
    if (chartType === 'monthly') {
      const monthlyData = standardData.data as {
        month: number;
        monthName: string;
        totalAmount: number;
        orderCount: number;
      }[];

      return {
        format: 'graph',
        chartType: 'bar',
        labels: monthlyData.map((m) => m.monthName),
        datasets: [
          {
            label: 'Order Amount',
            data: monthlyData.map((m) => m.totalAmount),
          },
          {
            label: 'Order Count',
            data: monthlyData.map((m) => m.orderCount),
          },
        ],
      };
    } else if (chartType === 'product') {
      const productData = standardData.data as ProductData[];

      return {
        format: 'graph',
        chartType: 'bar',
        labels: productData.map((p) => p.name),
        datasets: [
          {
            label: 'Total Amount',
            data: productData.map((p) => p.total),
          },
          {
            label: 'Quantity',
            data: productData.map((p) => p.quantity),
          },
        ],
      };
    } else {
      const statusData = standardData.data as StatusData[];

      return {
        format: 'graph',
        chartType: 'pie',
        labels: statusData.map((s) => s.status),
        datasets: [
          {
            label: 'Order Count by Status',
            data: statusData.map((s) => s.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // pending
              'rgba(54, 162, 235, 0.6)', // delivered
              'rgba(255, 206, 86, 0.6)', // cancelled
            ],
          },
        ],
      };
    }
  }

  async getDailyChartData(
    year?: number,
    month?: number,
    format: 'summary' | 'graph' = 'summary',
  ): Promise<DailyChartData> {
    // ตั้งค่าปีและเดือนปัจจุบันถ้าไม่ระบุ
    const currentDate = new Date();
    const reportYear = year || currentDate.getFullYear();
    const reportMonth = month || currentDate.getMonth() + 1;

    // สร้างช่วงวันที่สำหรับการกรอง
    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999);

    // ค้นหาคำสั่งซื้อในเดือนที่ระบุ
    const orders = await this.orderRecordRepository.find({
      where: {
        orderDate: Between(startDate, endDate),
      },
      relations: ['details'],
    });

    // จัดกลุ่มคำสั่งซื้อตามวัน
    const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();
    const dailyData: DailyOrderChartData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(reportYear, reportMonth - 1, day);
      const dayStr = date.toISOString().split('T')[0];

      const dayOrders = orders.filter(
        (order) => new Date(order.orderDate).getDate() === day,
      );

      const totalAmount = dayOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );

      dailyData.push({
        day,
        date: dayStr,
        orderCount: dayOrders.length,
        totalAmount,
      });
    }

    // Return summary data
    if (format === 'summary') {
      return {
        year: reportYear,
        month: reportMonth,
        monthName: startDate.toLocaleString('default', { month: 'long' }),
        data: dailyData,
      };
    }

    // Return graph data
    return {
      format: 'graph',
      chartType: 'line',
      labels: dailyData.map((d) => d.day.toString()),
      datasets: [
        {
          label: 'Daily Order Amount',
          data: dailyData.map((d) => d.totalAmount),
        },
        {
          label: 'Daily Order Count',
          data: dailyData.map((d) => d.orderCount),
        },
      ],
    };
  }
}
