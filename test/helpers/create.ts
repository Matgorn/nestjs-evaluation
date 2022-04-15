import { Factory } from 'rosie';
import { DeepPartial, getConnection, ObjectLiteral } from 'typeorm';

export async function create<T extends ObjectLiteral>(
  ctor: new () => T,
  attrs: Partial<T> = {},
) {
  const model = Factory.build<T>(ctor.name, attrs) as DeepPartial<T>;
  const repository = getConnection().getRepository(ctor);

  return await repository.save(model);
}
