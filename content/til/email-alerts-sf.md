---
date: 2023-10-25
draft: true
title: Email Alerts from Snowflake
subtitle: 
summary: 
cover: 
tags:
  - snowflake
  - til
---
# Email Alerts From Snowflake

You can send your team email alerts directly from Snowflake. This is useful when you want to monitor:
 - When snowflakes credit usage increases by a percentage
 - Resource consumption for snow pipes increases

You can do this by pairing a Snowflake Alert with a Notification Integration. [Notification Integrations](https://docs.snowflake.com/en/user-guide/alerts) are Snowflake constructs that provide an interface with 3rd party services like queues, email, etc. Email type integrations are natively supported.

1. Create a Notification Integration for Email
```sql
CREATE NOTIFICATION INTEGRATION email_integ
TYPE=EMAIL
ENABLED=TRUE
ALLOWED_RECIPIENTS=('rigomoran@mail.com');
```

2. Define a query to watch for a specific condition
```sql
SELECT SUM(credits_used) AS credits_used
FROM snowflake.account_usage.WAREHOUSE_METERING_HISTORY
WHERE start_time between CURRENT_DATE() and CURRENT_TIMESTAMP()
AND credits_used > 1;
```
This query shows the total credit consumption over the current day. This helps ensure we keep our consumption low.

3. Send a test email
```sql
CALL SYSTEM$SEND_EMAIL(
    'email_integ',
    'rigomoran@mail.com',
    'Email Alert: High Credit Usage for Warehouse',
    'Credit usage has exceeded 1 credit for today'
)
```
Snowflake provides a stored procedure to the email.


4. Create an Alert
```sql
CREATE OR REPLACE ALERT ALERT_HIGH_CREDIT_USAGE
WAREHOUSE = COMPUTE_WH
SCHEDULE = '30 MINUTES'
IF (EXISTS (
	-- Check for a specific condition
)
THEN 
	-- Send an email
;
```
This is basic syntax for an Alert. It requires a `WAREHOUSE` to handle the compute, a `SCHEDULE` to set the interval, `IF` condition to check for, and `THEN` the action to perform.

5. Put everything together
```sql
CREATE OR REPLACE ALERT ALERT_HIGH_CREDIT_USAGE
WAREHOUSE = COMPUTE_WH
SCHEDULE = '30 MINUTES'
IF (EXISTS (
	-- Check for a specific condition
    SELECT SUM(credits_used) AS credits_used
    FROM snowflake.account_usage.WAREHOUSE_METERING_HISTORY
    WHERE start_time between CURRENT_DATE() and SNOWFLAKE.ALERT.SCHEDULED_TIME()
    AND credits_used > 1;
)
THEN 
	-- Send an email
	CALL SYSTEM$SEND_EMAIL(
    'email_integ',
    'rigomoran@mail.com',
    'Email Alert: High Credit Usage for Warehouse',
    'Credit usage has exceeded 1 credit for today'
);
```

---
## References
1. [Alerts Overview](https://docs.snowflake.com/en/guides-overview-alerts) *Snowflake Docs*. snowflake.com
2. [Snowflake Alerts](https://www.youtube.com/watch?v=pRZ8v6NIAq8) *AICG Channel. youtube.com*