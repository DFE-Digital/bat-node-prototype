const DefaultNamingStrategy = require("typeorm").DefaultNamingStrategy;
const snakeCase = require("typeorm/util/StringUtils").snakeCase;

const namingStrategy = new DefaultNamingStrategy();

namingStrategy.tableName = (className, customName) => {
  return customName ? customName : snakeCase(className);
};

namingStrategy.columnName = (propertyName, customName, embeddedPrefixes) => {
  return snakeCase(embeddedPrefixes.join("_")) + (customName ? customName : snakeCase(propertyName));
};

namingStrategy.relationName = propertyName => {
  return snakeCase(propertyName);
};

namingStrategy.joinColumnName = (relationName, referencedColumnName) => {
  return snakeCase(relationName + "_" + referencedColumnName);
};

namingStrategy.joinTableName = (firstTableName, secondTableName, firstPropertyName, secondPropertyName) => {
  return snakeCase(firstTableName + "_" + firstPropertyName.replace(/\./gi, "_") + "_" + secondTableName);
};

namingStrategy.joinTableColumnName = (tableName, propertyName, columnName) => {
  return snakeCase(tableName + "_" + (columnName ? columnName : propertyName));
};

namingStrategy.classTableInheritanceParentColumnName = (parentTableName, parentTableIdPropertyName) => {
  return snakeCase(parentTableName + "_" + parentTableIdPropertyName);
};

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/entity/*.js"],
  migrationsTableName: "migration_table",
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations/"
  },
  namingStrategy: namingStrategy
};