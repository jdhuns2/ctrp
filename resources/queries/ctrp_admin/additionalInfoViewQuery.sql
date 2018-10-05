PARAMETERS(
   purchaseId INTEGER
   )

SELECT additionalInfoView.id,
additionalInfoView.purchase_id,
additionalInfoView.question_id,
additionalInfoView.question_text,
additionalInfoView.answer_text,
additionalInfoView.answer_value
FROM additionalInfoView where additionalInfoView.purchase_id = purchaseId;
