Parameters(
purchaseId integer
   )

SELECT fileView.id,
fileView.file_name,
fileView.hidden,
fileView.description,
fileView.username,
fileView.institution,
fileView.purchase_id,
fileView.created
FROM fileView where fileView.purchase_id = purchaseId;
