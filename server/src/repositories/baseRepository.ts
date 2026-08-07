import { type WhereOptions, Transaction, type QueryOptions } from "sequelize";
import type {
  Attributes,
  CreateOptions,
  IncludeOptions,
  Order,
  GroupOption,
  IncrementDecrementOptionsWithBy,
  UpsertOptions,
} from "sequelize/types/model";

import { Database } from "#src/database/connection.js";

interface RepositoryWriter<IT, RT> {
  create(input: Partial<IT>, options?: CreateOptions): Promise<RT>;
  bulkCreate(input: Partial<IT>[]): Promise<RT[]>;
  updateOne({
    id,
    input,
    transaction,
  }: {
    id: number | string;
    input: Partial<IT>;
    transaction?: Transaction;
  }): Promise<[number]>;
  update({
    where,
    input,
  }: {
    where: object;
    input: Partial<IT>;
  }): Promise<[number]>;
  deleteOne(id: number | string): Promise<number>;
  deleteMany({ where }: { where: object }): Promise<number>;
  restore(id: number): Promise<number>;
  hardDelete({ where }: { where: object }): Promise<number>;
  increment(
    field: keyof IT,
    options?: IncrementDecrementOptionsWithBy<Attributes<any>>,
  ): Promise<[affectedRows: RT[], affectedCount?: number]>;
  upsert(
    values: Partial<IT>,
    options?: UpsertOptions,
  ): Promise<[RT, boolean | null]>;
}

interface RepositoryReader<RT> {
  findAll({
    where,
    attributes,
    include,
    order,
    limit,
    logging,
    offset,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    limit?: number;
    logging?: boolean | ((sql: string, timing?: number) => void);
    offset?: number;
  }): Promise<RT[]>;
  findOne({
    where,
    attributes,
    include,
    order,
    paranoid,
    transaction,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    paranoid?: boolean;
    transaction?: Transaction;
  }): Promise<RT>;
  findByPk(
    id: number | string,
    options?: { attributes?: Attributes<any>; include?: IncludeOptions[] },
  ): Promise<RT>;
  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    limit,
    distinct,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
  }): Promise<{ count: number; rows: RT[] }>;
  count({
    where,
    include,
    distinct,
    col,
    transaction,
  }: {
    where?: WhereOptions<any>;
    include?: IncludeOptions[];
    distinct?: boolean;
    col?: string;
    transaction?: Transaction;
  }): Promise<number>;
  query(sql: string, options?: QueryOptions): Promise<unknown[]>;
}

export abstract class BaseRepository<IT, RT>
  implements RepositoryWriter<IT, RT>, RepositoryReader<RT>
{
  protected constructor(public readonly model: any) {}

  findAll({
    where,
    attributes,
    include,
    order,
    group,
    limit,
    logging,
    raw,
    offset,
    transaction,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    group?: GroupOption;
    limit?: number;
    raw?: boolean;
    logging?: boolean | ((sql: string, timing?: number) => void);
    offset?: number;
    transaction?: Transaction;
  }): Promise<RT[]> {
    return this.model.findAll({
      where,
      attributes,
      include,
      order,
      limit,
      group,
      logging,
      offset,
      transaction,
    });
  }

  findOne({
    where,
    attributes,
    include,
    order,
    paranoid,
    raw,
    transaction,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    paranoid?: boolean;
    raw?: boolean;
    transaction?: Transaction;
  }): Promise<RT> {
    return this.model.findOne({
      where,
      attributes,
      include,
      order,
      raw,
      paranoid,
      transaction,
    });
  }

  findByPk(
    id: number | string,
    options?: { attributes?: Attributes<any>; include?: IncludeOptions[] },
  ): Promise<RT> {
    return this.model.findByPk(id, options);
  }

  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    limit,
    distinct,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
  }): Promise<{ count: number; rows: RT[] }> {
    return this.model.findAndCountAll({
      where,
      attributes,
      include,
      order,
      offset,
      limit,
      distinct,
    });
  }

  count({
    where,
    include,
    distinct,
    col,
    transaction,
  }: {
    where?: WhereOptions<any>;
    include?: IncludeOptions[];
    distinct?: boolean;
    col?: string;
    transaction?: Transaction;
  }): Promise<number> {
    return this.model.count({
      where,
      include,
      distinct: distinct ?? true,
      col: col,
    });
  }

  create(input: Partial<IT>, options?: CreateOptions): Promise<RT> {
    return this.model.create(input, options);
  }

  bulkCreate(input: Partial<IT>[], options?: any): Promise<RT[]> {
    return this.model.bulkCreate(
      input,
      options ? options : { ignoreDuplicates: true },
    );
  }

  updateOne({
    id,
    input,
    transaction,
  }: {
    id: number | string;
    input: Partial<IT>;
    transaction?: Transaction;
  }): Promise<[number]> {
    return this.model.update(input, {
      where: { id },
      transaction: transaction,
    });
  }

  update({
    where,
    input,
    transaction,
  }: {
    where: WhereOptions<any>;
    input: Partial<IT>;
    transaction?: Transaction;
  }): Promise<[number]> {
    return this.model.update(input, { where: where, transaction: transaction });
  }

  deleteOne(id: number | string, transaction?: Transaction): Promise<number> {
    return this.model.destroy({ where: { id }, transaction: transaction });
  }

  deleteMany({
    where,
    transaction,
  }: {
    where: object;
    transaction?: Transaction;
  }): Promise<number> {
    return this.model.destroy({ where, transaction: transaction });
  }

  restore(id: number): Promise<number> {
    return this.model.restore({ where: { id } });
  }

  public query(sql: string, options?: QueryOptions): Promise<unknown[]> {
    return Database.sequelize.query(sql, options);
  }

  public hardDelete({ where }: { where: object }): Promise<number> {
    return this.model.destroy({ where, force: true });
  }

  public increment(
    field: keyof IT,
    options?: IncrementDecrementOptionsWithBy<Attributes<any>>,
  ): Promise<[affectedRows: RT[], affectedCount?: number]> {
    return this.model.increment(field, options);
  }

  public upsert(
    values: Partial<IT>,
    options?: UpsertOptions,
  ): Promise<[RT, boolean | null]> {
    return this.model.upsert(values, options);
  }
}
