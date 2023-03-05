export class CommentDetail {
  tripId: string;
  commentText: string;
  postedByUserId: string;
  constructor(tripId: string, postedByUserId: any, commentText: string) {
    this.tripId = tripId;
    this.postedByUserId = postedByUserId;
    this.commentText = commentText;
  }
}
