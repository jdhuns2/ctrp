--SELECT 
--response.id,
--response.answer_value,
--response.purchase_id,
--question.question_text
--FROM response inner join question on response.question_id = question.id;





SELECT answer.id,
answer.purchase_id,
question.id as question_id,
question.question_text,
answering.answer_text,
answer.answer_value
FROM answer
inner join question on question.id = answer.question_id
inner join answering on answering.id = answer.answer_id
