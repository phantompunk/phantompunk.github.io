---
date: 2023-10-21
draft: false
title: Create Table Schema From File
subtitle: 
summary: Infer table schema from file
cover: 
tags:
  - snowflake
  - sql
  - til
url: auto-table-schema
---
This is Snowflake specific; You can create a table definition directly from the file you want to ingest by *inferring* the file structure then building a template to create the table:

```sql
CREATE OR REPLACE TABLE RAW.SAMPLE_TABLE USING TEMPLATE
(
    SELECT ARRAY_AGG(OBJECT_CONSTRUCT(*))
    FROM TABLE(
        INFER_SCHEMA(
            LOCATION => @SANDBOX_STAGE/sample_data.parquet,
            FILE_FORMAT => 'SAMPLE_PARQUET_FORMAT'
        )
    )
);
```

Looks simple enough but lets take a closer look at what we are actually doing. A few keywords might stand out to you: `USING TEMPLATE`, **ARRAY_AGG**, *`OBJECT_CONSTRUCT`*, and *INFER_SCHEMA*. Lets see what each of those do and how they can work together.

```sql
CREATE OR REPLACE TABLE RAW.SAMPLE_TABLE(
  id int
  name varchar
  region varchar
)
```



What does `INFER_SCHEMA` do? It does what it sounds like, it detect the file schema for semi-structured data. The file needs to be housed in staged Snowflake area and the appropriate file format for the file needs to be defined

```sql
-- Create a file format that sets the file type as Parquet.
CREATE FILE FORMAT my_parquet_format
  TYPE = parquet;

-- Query the INFER_SCHEMA function.
SELECT *
  FROM TABLE(
    INFER_SCHEMA(
      LOCATION=>'@mystage'
      , FILE_FORMAT=>'my_parquet_format'
      )
    );

+-------------+---------+----------+---------------------+--------------------------+----------+
| COLUMN_NAME | TYPE    | NULLABLE | EXPRESSION          | FILENAMES                | ORDER_ID |
|-------------+---------+----------+---------------------+--------------------------|----------+
| continent   | TEXT    | True     | $1:continent::TEXT  | geography/cities.parquet | 0        |
| country     | VARIANT | True     | $1:country::VARIANT | geography/cities.parquet | 1        |
| COUNTRY     | VARIANT | True     | $1:COUNTRY::VARIANT | geography/cities.parquet | 2        |
+-------------+---------+----------+---------------------+--------------------------+----------+
```

What about `OBJECT_CONTRUCT`? Builds an object meaning whatever it read in it create object representation of that data.
```sql
SELECT OBJECT_CONSTRUCT('a',1,'b','BBBB', 'c',null);
+----------------------------------------------+
| OBJECT_CONSTRUCT('A',1,'B','BBBB', 'C',NULL) |
|----------------------------------------------|
| {                                            |
|   "a": 1,                                    |
|   "b": "BBBB"                                |
| }                                            |
+----------------------------------------------+
```

And `ARRAY_AGG`? Can combine a result set into an array
```sql
SELECT O_ORDERKEY AS order_keys
  FROM orders
  WHERE O_TOTALPRICE > 450000
  ORDER BY O_ORDERKEY;
+------------+
| ORDER_KEYS |
|------------|
|      41445 |
|      55937 |
|      67781 |
|      80550 |
|      95808 |
|     101700 |
|     103136 |
+------------+
```

How does combining the work? This is where `USING TEMPLATE` comes into play. This is special syntax to make use of the `INFER_SCHEMA` function

```sql
CREATE OR REPLACE TABLE RAW.SAMPLE_TABLE USING TEMPLATE
(
    SELECT ARRAY_AGG(OBJECT_CONSTRUCT(*))
    FROM TABLE(
        INFER_SCHEMA(
            LOCATION => @SANDBOX_STAGE/sample_data.parquet,
            - [ ] FILE_FORMAT => 'SAMPLE_PARQUET_FORMAT'
        )
    )
);
```

---
1. https://docs.snowflake.com/en/sql-reference/functions/infer_schema
2. https://docs.snowflake.com/en/sql-reference/functions/object_construct
3. https://docs.snowflake.com/en/sql-reference/functions/array_agg
4. https://docs.snowflake.com/en/sql-reference/sql/create-table#create-table-using-template