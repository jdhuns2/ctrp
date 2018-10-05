PARAMETERS(
purchaseId integer
)

SELECT
purchase."id",
address."id" AS "id_0",
address.firstname,
address.lastname,
address.address,
address.city,
address."state",
address.zip,
address.country,
address."institution_string",
address.email AS "email_0",
address.fax,
address.phone,
address.address2,
'billing' as "address_type"
FROM
address
JOIN purchase
ON address."id" = purchase."billing_address" where purchase.id = purchaseId

UNION ALL

SELECT
purchase."id",
address."id" AS "id_0",
address.firstname,
address.lastname,
address.address,
address.city,
address."state",
address.zip,
address.country,
address."institution_string",
address.email AS "email_0",
address.fax,
address.phone,
address.address2,
'shipping' as "address_type"
FROM
address
JOIN purchase
ON address."id" = purchase."shipping_address" where purchase.id = purchaseId
