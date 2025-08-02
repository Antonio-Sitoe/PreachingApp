import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { minutesToHoursAndMinutes } from '@/utils/dates';
import { sorteByMonths, sorteByYears } from '@/utils/helper';
import groupBy from 'group-by';
import { type NewReport, reports } from '../schemas/reports';
import dayjs from 'dayjs';

class ReportsActions {
  async create(newRecordData: NewReport) {
    try {
      const existingRecords = await db
        .select()
        .from(reports)
        .where(eq(reports.date, String(newRecordData.date)));

      if (existingRecords.length > 0) {
        const existingRecord = existingRecords[0];

        const updatedRecord = await db
          .update(reports)
          .set({
            hours: existingRecord.hours + newRecordData.hours,
            minutes: existingRecord.minutes + newRecordData.minutes,
            students: existingRecord.students + newRecordData.students,
            comments: newRecordData.comments || existingRecord.comments,
            updatedAt: String(new Date()),
          })
          .where(eq(reports.id, existingRecord.id))
          .returning();

        return updatedRecord[0];
      }
      const newRecord = await db
        .insert(reports)
        .values({
          date: String(newRecordData.date),
          year: newRecordData.year,
          month: newRecordData.month,
          day: newRecordData.day,
          hours: newRecordData.hours,
          minutes: newRecordData.minutes,
          students: newRecordData.students,
          comments: newRecordData.comments,
          createdAt: String(new Date()),
          updatedAt: String(new Date()),
        })
        .returning();

      return newRecord[0];
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<NewReport>) {
    try {
      const updatedRecord = await db
        .update(reports)
        .set({
          hours: updateData.hours,
          minutes: updateData.minutes,
          students: updateData.students,
          comments: updateData.comments,
          date: updateData.date ? String(updateData.date) : undefined,
          year: updateData.year,
          month: updateData.month,
          day: updateData.day,
          updatedAt: String(new Date()),
        })
        .where(eq(reports.id, id))
        .returning();

      return updatedRecord[0];
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }
  async delete(id: string) {
    try {
      await db.delete(reports).where(eq(reports.id, id)).returning();
      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
  async reset() {
    try {
      await db.delete(reports);
    } catch (error) {
      console.error('Error resetting reports:', error);
      throw error;
    }
  }

  async getAll() {
    const allReports = await db.select().from(reports);
    return allReports;
  }

  async getGlobalStates({
    month,
    year,
    wantReports = false,
  }: {
    month: number;
    year: number;
    wantReports?: boolean;
  }) {
    const [result] = await db
      .select({
        hours: sql<number>`coalesce(SUM(${reports.hours}), 0)`,
        minutes: sql<number>`coalesce(SUM(${reports.minutes}), 0)`,
        students: sql<number>`coalesce(SUM(${reports.students}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(reports)
      .where(and(eq(reports.month, month), eq(reports.year, year)));

    const isParticipated = (result?.count ?? 0) > 0;

    const data = {
      hours: result.hours,
      minutes: result.minutes,
      students: result.students,
      time: minutesToHoursAndMinutes(result.hours, result.minutes),
      isParticipated,
    };

    if (wantReports) {
      const reportsFiltered = await db
        .select()
        .from(reports)
        .where(and(eq(reports.month, month), eq(reports.year, year)));

      return { data, reports: reportsFiltered };
    }

    return { data, reports: [] };
  }

  async getByYear(year: number) {
    const [result] = await db
      .select({
        hours: sql<number>`COALESCE(SUM(${reports.hours}), 0)`,
        minutes: sql<number>`COALESCE(SUM(${reports.minutes}), 0)`,
        students: sql<number>`COALESCE(SUM(${reports.students}), 0)`,
      })
      .from(reports)
      .where(eq(reports.year, year));
    const data = {
      hours: result.hours,
      minutes: result.minutes,
      students: result.students,
      time: minutesToHoursAndMinutes(result.hours, result.minutes),
    };
    return { data };
  }

  async getTotalRecords() {
    const result = await db.select({ count: reports.id }).from(reports);
    return { count: result.length };
  }

  async getAllAndGroupByYearAndMonth() {
    const reportsFiltered = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.year), desc(reports.month), desc(reports.day));

    const transform_report_to_years = Object.entries(
      groupBy(reportsFiltered, 'year')
    );
    const data_sorted = sorteByYears(transform_report_to_years);
    const final_report_data = data_sorted.map((reportArray) => {
      const arrayOfReports = reportArray[1] as any[];
      const reports = groupBy(arrayOfReports, 'month');
      return {
        year: reportArray[0],
        reports: sorteByMonths(Object.entries(reports)),
      };
    });

    return { data: final_report_data };
  }

  async getAllGroupByYear() {
    const reportsFiltered = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.year), desc(reports.month), desc(reports.day));

    const transform_report_to_years = Object.entries(
      groupBy(reportsFiltered, 'year')
    );
    const data_sorted = sorteByYears(transform_report_to_years);
    const final_report_data = data_sorted.map((reportArray) => {
      const arrayOfReports = reportArray[1] as any[];
      const reports = groupBy(arrayOfReports, 'month');
      return {
        year: reportArray[0],
        reports: sorteByMonths(Object.entries(reports)),
      };
    });

    return { data: final_report_data };
  }

  async getPartialReportData(page: number, limit: number) {
    const { count } = await this.getTotalRecords();
    const totalPage = Math.ceil(count / limit);
    const skip = page * limit;
    const take = limit;

    const reportsData = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.year), desc(reports.month), desc(reports.day))
      .limit(take)
      .offset(skip);

    console.log('=========================');
    console.log('SKIP', skip);
    console.log('TAKE', take);
    console.log('Pagina atual ', page);
    console.log('TOTAL PAGE', totalPage);
    console.log('ITEMS NA DATABASE', count);
    console.log('ITEMS A LEVAR', reportsData.length);
    return { data: reportsData, totalPage };
  }

  async getById(id: string) {
    const reportsFiltered = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id));
    return reportsFiltered[0];
  }
}

export const reportsActions = new ReportsActions();
