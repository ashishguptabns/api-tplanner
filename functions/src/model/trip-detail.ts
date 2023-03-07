import { DocumentData } from "firebase-admin/firestore";
import { ActivityDetail } from "./activity-detail";

export class TripDetail {
  id!: string;
  cityTo!: string;
  totalBudget!: number;
  interCityTravelCost!: number;
  withinPlaceCommuteCost!: number;
  departDate!: string;
  cityImgUrl: any;
  cityFrom!: string;
  returnDate!: string;
  isPrivate!: boolean;
  activities!: ActivityDetail[];
  constructor(tripData?: DocumentData) {
    if (tripData) {
      this.id = tripData.id;
      this.cityTo = tripData.cityTo;
      this.totalBudget = tripData.totalBudget;
      this.interCityTravelCost = tripData.interCityTravelCost;
      this.withinPlaceCommuteCost = tripData.withinPlaceCommuteCost;
      this.departDate = tripData.departDate;
      this.cityImgUrl = tripData.cityImgUrl;
      this.cityFrom = tripData.cityFrom;
      this.returnDate = tripData.returnDate;
      this.isPrivate = tripData.isPrivate;
      this.activities = tripData.activities;
    }
  }
}
