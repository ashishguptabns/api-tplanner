import { DocumentData } from "firebase-admin/firestore";

export class TripDetail {
  dateRange: any;
  cityTo: string;
  totalBudget: number;
  departDate: string;
  cityImgUrl: any;
  cityFrom: string;
  returnDate: string;
  isPrivate: boolean;
  constructor(tripData: DocumentData) {
    this.dateRange = tripData.dateRange;
    this.cityTo = tripData.cityTo;
    this.totalBudget = tripData.totalBudget;
    this.departDate = tripData.departDate;
    this.cityImgUrl = tripData.cityImgUrl;
    this.cityFrom = tripData.cityFrom;
    this.returnDate = tripData.returnDate;
    this.isPrivate = tripData.isPrivate;
  }
}
