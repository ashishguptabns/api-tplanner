import { DocumentData } from "firebase-admin/firestore";

export class UserDetail {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  constructor(userSnapshotData?: DocumentData) {
    this.uid = userSnapshotData?.uid;
    this.displayName = userSnapshotData?.displayName;
    this.photoURL = userSnapshotData?.photoURL;
    this.email = userSnapshotData?.email;
  }
}
