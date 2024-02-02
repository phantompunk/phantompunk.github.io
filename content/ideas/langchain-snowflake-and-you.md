---
title: langchain-snowflake-and-you
subtitle: An example subtitle
summary: Summary of the example
date: 2024-01-31
draft: true
slug: example-post
tags:
  - llm
  - python
---
- Ask your data warehouse questions in natural language with real answers
- Using LangChain + LLM of choice (AWS Bedrock) + Snowflake
- Quickstart + Setup of LangChain + Snowflake
- Add an LLM (AWS Bedrock)
- Ask a question to validate
- Why is the generated output bad? How can modify the prompt
- Try again with more questions
- Add a SQL Agent
- Respond with natural language
- Call to action -> Other improvements -> Where to build upon

Data is kurt/difficult/hard to grok. The experts are usually spread thin, in low numbers, and typically have a spiky knowledge (they are human). There's some appeal to multiplying the experts and clearing they're low level tasks and random questions. GenAI systems might be able to fit that role... today.

I want to explore what off the shelf components are capable of with enterprise data. For this experiment I've selected AWS Bedrock to provide the LLM capacity, and secured a Snowflake data warehouse instance filled with health insurance claim data (fyi completely generated). The goal is to understand the capacity of a LangChain Agent + LLM with unfettered database access.

Before we begin lets briefly touch on the LangChain Framework. At a high level its framework with well defined abstractions encapsulating common components enabling them be *chained* together. The ELI5 version is: its lego components for GenAI that can easily be pieced together.

Those components fall into three categories:
1. Models: Wrappers around Databases, LLMs, and other tools
2. Agents: With the help of LLMs are able to interact with external sources
3. Chains: Crucial glue holding compents together, can provide context

With that out of the way, here is the rough plan of attack:

![[langchain-overview.png]]

Here's the break down:
1. A user asks a question
2. An LLM begins to grok the input
3. SQL Query Chain establishes a connection to DB
4. DB returns table/schema information along with a sample of data (3 records)
5. Query Chain with the LLM can use DB context along with specialized promptTemplate can formulate a query
6. It sends the query to the Agent to execute
7. Returns query response to the LLM
8. LLM formulates a response using the results for the user

Now for the fun part!

To accentuate the idea of Lego bricks we'll build out each component incrementally.
https://api.python.langchain.com/en/latest/utilities/langchain_community.utilities.sql_database.SQLDatabase.html#
To begin, lets create a connection to Snowflake using a [SQLAlchemy powered class](https://api.python.langchain.com/en/latest/utilities/langchain_community.utilities.sql_database.SQLDatabase.html#).
```python
import os
from dotenv import load_dotenv

from langchain_community.utilities import SQLDatabase
load_dotenv()

def get_snowflake_uri() -> str:
    env = os.environ.copy()
    return "snowflake://{}:{}@{}/{}/{}?warehouse={}&role={}".format(
        env["USERNAME"],
        env["PASSWORD"],
        env["ACCOUNT"],
        env["DATABASE"],
        env["SCHEMA"],
        env["WAREHOUSE"],
        env["ROLE"],
    )

def main():
    db = SQLDatabase.from_uri(get_snowflake_uri())
    print(f"Dialect {db.dialect}, Table Names {db.get_usable_table_names()}, Table Info: {db.get_table_info()}")

if __name__ == "__main__":
    main()
```
([rag_start.py]())

Next lets configure the Bedrock LLM:
```python
def main():
	...
	llm = BedrockChat(
        model_id="anthropic.claude-v2",
        model_kwargs={"temperature":0, "maxTokenCount": 128},
        client=bedrock.get_bedrock_client()
    )
```
([rag_b.py]())

Lets generate a query using a chain:
```python
...
chain = create_sql_query_chain(llm, db)
```
([rag_b.py]())


## Further Reading
- 