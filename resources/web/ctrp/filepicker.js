/*FilePicker.js
Uploads files to database from labkey.
ENVIRONMENT must be defined as 1 (PRODUCTION) or 0 (DEVELOPMENT)

To create a new file picker:

Ext4.create('FilePicker.view.FilePanel',{
		ctrpfileId:'1'
		category:'other',
		description:'test description'
	}).show();

The method .showAt(x,y) can also be used

UPDATING A FILE:
 -Use the ctrpfileId config and give the ctrpfile id of the file to be updated
 -category and description can be blank

NEW FILE:
 -ctrpfileId must be null/undefined i.e. just leave it out
 -category must be one of unsigned_disclaimer, signed_disclaimer, completed_profstudy, other, taxdoc, po,
 disclaimer_nongovernmental, disclaimer_governmental, orderform, invoice, template, report, or protocol

On successful upload a fileUploadSuccess event is fired with the returned ctrpfile id to listen
place following code in your controller:

init: function() {
		this.listen({
			controller:{
				'*':{
					fileUploadSuccess:'onFileUploadSuccess'
				}
			}
		});
    }

//for testing
 var PRODUCTION = 1;
var DEVELOPMENT = 0;

var ENVIRONMENT = DEVELOPMENT;

if(ENVIRONMENT==PRODUCTION){
var SCHEMANAME = "ctrp_admin";
}
else{
var SCHEMANAME = 'ctrp';
}
*/


Ext4.define('FilePicker.view.FileInput', {
	extend:'Ext4.panel.Panel',
	alias:'widget.fileinput',
    width:400,
    html: "<input id='inputFile' type='file' name='uploaded'/>",
    listeners: {
        afterrender: function() {
            itemFile = document.getElementById("inputFile");
            //itemFile.addEventListener('change', this.eventChange, false);
        }
   },

});

Ext4.define('FilePicker.view.FilePanel', {
    extend: 'Ext4.window.Window',
    title: 'Upload file',
    alias: 'widget.filepanel',
    autoshow: 'true',
    bodyPadding: 10,

    modal: 'true',
    initComponent: function(){
		if(this.category == null){
			alert('File missing category, it cannot be uploaded');
			this.close();
		}
		var baseURL = '';
		if(ENVIRONMENT == PRODUCTION){
			baseURL = 'https://ctrp.uky.edu';
		}
		else{
			baseURL = 'https://refcig-dev.uky.edu';
		}
		this.formURL = baseURL + '/refcig-services/admin/uploadDocument/' + this.ctrpfileId;

		if(Ext4.isIE && this.ctrpfileId == null){
			this.formURL = baseURL + '/refcig-services/admin/uploadDocumentIE/0';
		}
		else if(Ext4.isIE){
			this.formURL = baseURL + '/refcig-services/admin/uploadDocumentIE/' + this.ctrpfileId;
		}
		else if(this.ctrpfileId == null){
			this.formURL = baseURL + '/refcig-services/admin/uploadDocument/0';
		}

		console.log(this.formURL);
		this.items = [{
			xtype:'fileinput',
			border: 0

		}];
		this.buttons =  [{
				text: 'Upload',
				handler: this.uploadFile.bind(this)
			}];
		this.callParent(arguments);
    },

    uploadFile: function(){
		//check if file is selected
		if(document.getElementById('inputFile').files == null){
			alert('No file selected!');
			return;
		}

		var xhr;
		if(Ext4.isIE){
			xhr = new XDomainRequest();
		}
		else{
			xhr = new XMLHttpRequest();
		}

		xhr.onload =  this.successFunction.bind(xhr,this);
		//because it is cross domain request errors are not returned from the server with appropriate headers thus
		//the onerror event is never called so onprogress is used instead.  Can only be one of a couple errors
		xhr.onprogress = function(event){
			console.log(this);
			if(event.loaded == 0){//and error happened
				alert('An error occured while uploading the file. \n 1. Are you logged in to ctrp.uky.edu?\n 2. Is the file a permitted file type?\n 3. (Developer) Is the file category correct?');
			}
		}

		var inputfile = document.getElementById('inputFile').files[0];
		var fd = new FormData();
		//fd.append('ctrpfileId', this.ctrpfileId);
		fd.append('file', inputfile);
		fd.append('category', this.category);
		fd.append('description', this.description);

		xhr.open('POST', this.formURL,true);
		xhr.withCredentials = true;
		xhr.send(fd);

    },
	successFunction:function(windowPanel){
		windowPanel.fireEvent('fileUploadSuccess',parseInt(this.responseText),windowPanel.caller);
		windowPanel.close()
	},

});

Ext4.define('FilePicker.controller.FileController',{
	extend: 'Ext4.app.Controller',
	views:['FilePanel'],
	refs:[
		{ref:'filePanel',//this will generate a getControlPanel() function
		selector:'filepanel'//same as the widget name
		}
	],
	init: function() {
		this.listen({
				component:{//place multiple listeners in same object
					'filepanel':{fileUploadSuccess:this.onFileUploadSuccess}
					},
				});
    },
	onFileUploadSuccess:function(ctrpfileId,caller){
		console.log('uploadsuccess '+ctrpfileId);
		this.fireEvent('fileUploadSuccess',ctrpfileId,caller);
	},

});
/* For testing
Ext4.application({

name:'FilePicker',
  controllers: ['FilePicker.controller.FileController'],

  launch: function(){//fires once page is ready


	Ext4.create('FilePicker.view.FilePanel',{
		category:'other',
		description:'test description'
	}).show();

}
});
*/
