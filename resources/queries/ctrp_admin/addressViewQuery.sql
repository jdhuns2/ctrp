PARAMETERS(
shipping_address_id INTEGER,
   billing_address_id INTEGER
)

SELECT addressesView.id,
addressesView.addresstype,
addressesView.firstname,
addressesView.lastname,
addressesView.address,
addressesView.city,
addressesView.state,
addressesView.zip,
addressesView.country,
addressesView.institution_string,
addressesView.email,
addressesView.fax,
addressesView.phone,
addressesView.purchase_id,
addressesView.address2
FROM addressesView where id = shipping_address_id or id = billing_address_id;
