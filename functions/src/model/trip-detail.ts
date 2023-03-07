import { DocumentData } from "firebase-admin/firestore";
import { ActivityDetail } from "./activity-detail";
import { CommentDetail } from "./comment-detail";

export class TripDetail {
  id!: string;
  postedByUserId!: string;
  cityTo!: string;
  totalBudget!: number;
  interCityTravelCost!: number;
  withinPlaceCommuteCost!: number;
  departDate!: string;
  cityImgUrl: any;
  cityFrom!: string;
  returnDate!: string;
  isPrivate!: boolean;
  postedByPhotoUrl = "";
  activities!: ActivityDetail[];
  comments: CommentDetail[] = [];
  constructor(tripData?: DocumentData) {
    if (tripData) {
      this.id = tripData.id;
      this.postedByUserId = tripData.postedByUserId;
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
