import type { PHQNineInterface } from "#src/interfaces/screeningInterface.js";
import Model from "#src/models/index.js";
import { BaseRepository } from "./baseRepository.js";

export class PHQNineRepository extends BaseRepository<
  PHQNineInterface,
  PHQNineInterface
> {
  constructor() {
    super(Model.PHQNine);
  }
}
