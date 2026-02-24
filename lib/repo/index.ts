import { MongoDBRepository } from "./MongoDBRepository";
import type { IDataRepository } from "./IDataRepository";

let repo: IDataRepository | null = null;

export function getRepository(): IDataRepository {
  if (!repo) {
    repo = new MongoDBRepository();
  }
  return repo;
}
