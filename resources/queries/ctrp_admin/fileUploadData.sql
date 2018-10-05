SELECT 
Data.rowid,
Data.Name,
Data.Run,
Data.DataFileUrl,
Data.flag.comment,
Data.FileExtension
FROM Data
WHERE Data.DataFileUrl like '%uploads%'
