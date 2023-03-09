import { DocumentData } from "firebase-admin/firestore";

export class BlogDetail {
  id = "";
  imgUrl: string = "";
  text = "";
  constructor(blogData?: DocumentData) {
    if (blogData) {
      this.id = blogData.id;
      this.imgUrl = blogData.imgUrl;
      this.text = blogData.text;
    }
  }
}
