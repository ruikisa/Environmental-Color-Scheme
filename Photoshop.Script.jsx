/**Spatial Color Compass(SCC)**/



var inputFolder = Folder.selectDialog("Input folder");
var outputFolder = Folder.selectDialog("Output folder");
 
if (inputFolder != null && outputFolder != null) {
    var files = inputFolder.getFiles("*.JPG");
 
    for (var i = 0; i < files.length; i++) {
         var file = files[i];
         var doc = app.open(file);
       
     // 修改使用單位前先作備份
     var orig_unit  = preferences.rulerUnits;
     preferences.rulerUnits = Units.PIXELS;

     var my_doc = documents[0];
     var my_layer = my_doc.activeLayer;
     var my_width = my_doc.width;
     var my_height = my_doc.height;

     //圖層解鎖
     var topLayer = app.activeDocument.layers[0];  
     app.activeDocument.activeLayer = topLayer;  
     do{  
     unlockLayer();  
     } 
     while(topLayer != app.activeDocument.activeLayer)  
     
     function unlockLayer(){  
         if(app.activeDocument.activeLayer.isBackgroundLayer ) app.activeDocument.activeLayer.name = 'Background';  
         if(app.activeDocument.activeLayer.allLocked) app.activeDocument.activeLayer.allLocked = false;  
         if(app.activeDocument.activeLayer.pixelsLocked) app.activeDocument.activeLayer.pixelsLocked = false;  
         if(app.activeDocument.activeLayer.positionLocked) app.activeDocument.activeLayer.positionLocked = false;  
         if(app.activeDocument.activeLayer.transparentPixelsLocked) app.activeDocument.activeLayer.transparentPixelsLocked = false;  
     }

     //色調分離
     //my_layer.posterize(8);

    ////取色部分
     //天空
     var shapeSky =
     Array(Array(0,0), Array(0, my_height*0.25), Array(my_width, my_height*0.25), Array(my_width, 0));
     my_doc.selection.select(shapeSky);
     // 使用濾鏡：平均模糊
     my_layer.applyAverage();
     // 取消選取
     my_doc.selection.deselect();




     //中層
    for (var j=0.25; j<=0.5; j+=0.25) {
        for (var k=0.0; k<1.0; k+=0.2){
     var shapeVL =
     Array(Array(my_width*k, my_height*j), Array(my_width*k, my_height*(j+0.25)), Array(my_width*(k+0.2), my_height*(j+0.25)), Array(my_width*(k+0.2), my_height*j));
     my_doc.selection.select(shapeVL);
            // 使用濾鏡：平均模糊
     my_layer.applyAverage();
            // 取消選取
     my_doc.selection.deselect();
           }
    }


     //地層
     var shapeEarth =
     Array(Array(0, my_height*0.75), Array(0, my_height), Array(my_width, my_height), Array(my_width, my_height*0.75));
     my_doc.selection.select(shapeEarth);
     // 使用濾鏡：平均模糊
     my_layer.applyAverage();
     // 取消選取
     my_doc.selection.deselect();

 
      var mySampler1 = app.activeDocument.colorSamplers.add([new UnitValue( 10,'px'),new UnitValue(10,'px')]);
      var R = Math.round(mySampler1.color.rgb.red);
      var G = Math.round(mySampler1.color.rgb.green);
      var B = Math.round(mySampler1.color.rgb.blue);
      app.activeDocument.colorSamplers.removeAll();
      var TextInfo_Sky = "R:"+ R + " G:" + G +" B:" + B ;



      /*for (var a1=0; a1<5; a1++){
      var X1 = activeDocument.width;  
      var Y1 = activeDocument.height; 
      for (var j1=0.25; j1<=0.5; j1+=0.25) {
        for (var k1=0.0; k1<1.0; k1+=0.2){
      var mySampler2 = app.activeDocument.colorSamplers.add([new UnitValue(X1*(k1+0.2)+10,'px'),new UnitValue(Y1*(j1*2)+10,'px')]);
      var R = Math.round(mySampler2.color.rgb.red);
      var G = Math.round(mySampler2.color.rgb.green);
      var B = Math.round(mySampler2.color.rgb.blue);
      app.activeDocument.colorSamplers.removeAll();
      var TextInfo_V = "R:"+ R + " G:" + G +" B:" + B ;
          }
        }
      }*/


      var X3 = activeDocument.width*0.75;  
      var Y3 = activeDocument.height*0.75; 
      var mySampler4 = app.activeDocument.colorSamplers.add([new UnitValue(X3+10,'px'),new UnitValue(Y3+10,'px')]);
      var R = Math.round(mySampler4.color.rgb.red);
      var G = Math.round(mySampler4.color.rgb.green);
      var B = Math.round(mySampler4.color.rgb.blue);
      app.activeDocument.colorSamplers.removeAll();
      var TextInfo_Earth = "R:"+ R + " G:" + G +" B:" + B ;


        //將一個長字串分解成單個字元串
        function explodeArray(item) {
            var i=0;
            var Count=0;
            var tempString=new String(item);
            tempArray=new Array(1);

        do{
        i=tempString.indexOf(":");
        if(i>0)
        tempString=tempString.substr(i+1,tempString.length-i-1);
        i=tempString.indexOf(">");
        if(i>0)
        {
        tempArray[Count]=tempString.substr(0,i);
        tempString=tempString.substr(i+1,tempString.length-i-1);
        Count ++;
        }
        i=tempString.indexOf("<");
        if(i>0)
        {
        tempArray[Count]=tempString.substr(0,i);
        tempString=tempString.substr(i-1,tempString.length-i+1);
        Count ++;
        }
        }while (tempString.indexOf("</x:xmpmeta>")>0);

        tempArray[Count]=tempString;
        return tempArray;
        }

        var AD = activeDocument;
        var resRatio = AD.resolution/72;

        if(resRatio!=1){
        AD.resizeImage(AD.width.value,AD.height.value,72);
        }

        var heightVar = AD.height.value+2;
        var photoWidth = AD.width.value;
        var photoHight = AD.height.value;

        //獲取RAW保存的信息
        var exifData = AD.xmpMetadata.rawData.toString();

        //將EXIF信息分成單個的相關信息
        explodeArray(exifData);

        var stringTemp=""; //臨時字串

        //--------------------------------gps變數說明------------------------------
          var GPSLatitude         = "";               //GPS緯度
          var GPSLongitude         = "";              //GPS經度
          var GPSAltitude        = "";                //GPS高度

        var i=0;
        var j=0;
        var k=0;
        var dateArray1="";
        var dateArray2="";
        var monthsArray="";
        var phoDate = "";
        var phoTime = "";

        //Photoshop CS獲取EXIF信息



        //--------------------------gps數據讀取------------------------------------
           //gps緯度
           
          
          for(n = 0; n < tempArray.length; n ++) 
          { 
            stringTemp = tempArray[n];
            if(stringTemp.indexOf("GPSLatitude") != -1)
            { 
              GPSLatitude = tempArray[n+1];
              break;
            } 
          }
        //GPSLatitude="  "+GPSLatitude;

            //gps經度
          for(n = 0; n < tempArray.length; n ++) 
          { 
            stringTemp = tempArray[n];
            if(stringTemp.indexOf("GPSLongitude") != -1)
            { 
              GPSLongitude = tempArray[n+1];
              break;
            } 
          }


          //gps高度
          for(n =0; n < tempArray.length; n ++) 
          { 
            stringTemp = tempArray[n];
            if(stringTemp.indexOf("GPSAltitude") != -1)
            { 
              GPSAltitude= tempArray[n+5];
              break;
            } 
          }

        //--------------------gps數據讀取完畢---------------------------



        /*
        //整理gps高度值
        dateArray1 = GPSAltitude.split("/");
        i = dateArray1[0];
        j = dateArray1[1];
        if(j>1)
        GPSAltitude=i/j;
        else
        GPSAltitude=i;
        if(GPSAltitude!="")
        GPSAltitude=GPSAltitude+"m";
        GPSLatitude="   "+GPSLatitude+"  "+GPSLongitude+"   "+GPSAltitude;
        */

        var TextInfo2 = GPSLatitude + " , " + GPSLongitude 

        function createText(Size,TextInfo_Sky,TextInfo_Earth,TextInfo2){
        var Percent = Size; 
        var Black = new SolidColor();
        Black.rgb.hexValue = '000000';
        var newTextLayer = activeDocument.artLayers.add(); 

        newTextLayer.kind = LayerKind.TEXT; 
        newTextLayer.textItem.kind = TextType.POINTTEXT;
        //newTextLayer.textItem.color = Black; 
        //newTextLayer.textItem.font = "Georgia";
        //newTextLayer.textItem.size = 10; 
        //newTextLayer.textItem.contents = TextInfo;
        newTextLayer.textItem.contents = TextInfo2;

        var startRulerUnits = app.preferences.rulerUnits;
        app.preferences.rulerUnits = Units.PIXELS;
        var myDoc = activeDocument;
        var LB = myDoc.activeLayer.bounds; 
        var docHeight = myDoc.height;
        var docWidth = myDoc.width;
        //var LHeight = Math.abs(LB[3].value) - Math.abs(LB[1].value);
        //var LWidth = Math.abs(LB[2].value) - Math.abs(LB[0].value);    
        //var percentageHeight = ((docHeight/LWidth)*Percent); 
        //var percentageWidth = ((docWidth/LWidth)*Percent); 

        /*if(docWidth < docHeight){
        myDoc.activeLayer.resize(percentageWidth,percentageWidth,AnchorPosition.MIDDLECENTER);
        }else{   
          myDoc.activeLayer.resize(percentageHeight,percentageHeight,AnchorPosition.MIDDLECENTER);
          }*/
        align('AdCH'); align('AdTp');
        activeDocument.activeLayer.translate(0,offsetY);
        app.preferences.rulerUnits = startRulerUnits;
        }

        function align(method) { 
        activeDocument.selection.selectAll();
           var desc = new ActionDescriptor();
                   var ref = new ActionReference();
                   ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) ); 
               desc.putReference( charIDToTypeID( "null" ), ref ); 
               desc.putEnumerated( charIDToTypeID( "Usng" ), charIDToTypeID( "ADSt" ), charIDToTypeID( method ) );
              try{
           executeAction( charIDToTypeID( "Algn" ), desc, DialogModes.NO ); 
           }catch(e){}
           activeDocument.selection.deselect();
           }



        //export text
          var useDialog = true;
          // Open file when done (true/false)? - This will be overriden to true when running TextExport on multiple files!
          var openFile  = true;
          // text separator
          //var separator = "*************************************";

          /*var newLayer = app.activeDocument.artLayers.add()
             newLayer.name = "new"*/
         /**
          * NO NEED TO CHANGE ANYTHING BENEATH THIS LINE
          * -------------------------------------------------------------
          */
          /**
           *  TextExport Init function
           * -------------------------------------------------------------
           */
            function initTextExport() {
              // Linefeed shizzle
              if ($.os.search(/windows/i) != -1)
                fileLineFeed = "windows";
              else
                fileLineFeed = "macintosh";
              // Do we have a document open?
              /*if (app.documents.length < 1) {
                alert("Please open at least one file", "TextExport Error", true);
                return;
              }*/
              // Oh, we have more than one document open!
              if (app.documents.length > 1) {
                var runMultiple = confirm("TextExport has detected Multiple Files.\nDo you wish to run TextExport on all opened files?", true, "TextExport");
                if (runMultiple === true) {
                  docs = app.documents;         
                } /*else {        
                  docs = [app.activeDocument];
                }*/
              } else {
                runMultiple   = false;
                docs    = [app.activeDocument];
              }
              // Loop all documents
              for (var i = 0; i < docs.length; i++)
              {
                // useDialog (but not when running multiple
                if ( (runMultiple !== true) && (useDialog === true) )
                {
                  // Pop up save dialog
                  
                  
                } 
                // Don't use Dialog

                var saveFile = File.saveDialog("Please select a file to export the text to:");
                  // User Cancelled
                  if(saveFile == null)
                  {
                    alert("User Cancelled");
                    return;
                  }
                // set filePath and fileName to the one chosen in the dialog
                  filePath = saveFile.path + "/" + saveFile.name;
                /*{
                  // Auto set filePath and fileName
                  filePath = Folder.myDocuments + '/' + docs[i].name + '.txt';
                }*/
                // create outfile
                var fileOut = new File(filePath);
                // clear dummyFile
                dummyFile = null;
                // set linefeed
                fileOut.linefeed = fileLineFeed;
                // open for write
                fileOut.open("w", "TEXT", "????");
                // Append title of document to file
                //fileOut.writeln(separator);
                fileOut.writeln(TextInfo_Sky);
                //fileOut.writeln(TextInfo_V);
                fileOut.writeln(TextInfo_Earth);
              
                // Set active document
                //app.activeDocument = docs[i];
                // call to the core with the current document
                //goTextExport2(app.activeDocument, fileOut, '/');
                //  Hammertime!
                //fileOut.writeln(separator);
                fileOut.writeln(TextInfo2);
                fileOut.writeln(my_doc.name);
                //fileOut.writeln(separator);
                // close the file
                //fileOut.close();
                // Give notice that we're done or open the file (only when running 1 file!)
                /*if (runMultiple === false)
                {
                  if (openFile === true)
                    fileOut.execute();
                  else
                    alert("File was saved to:\n" + Folder.decode(filePath), "TextExport");
                }
              }
              if (runMultiple === true)
              {
                alert("Parsed " + documents.length + " files;\nFiles were saved in your documents folder", "TextExport");
              }*/
              }
              }
            /**
             * TextExport Core Function (V2)
             * -------------------------------------------------------------
           */
            function goTextExport2(el, fileOut, path) 
            {
              // Get the layers
              var layers = el.layers;
              // Loop 'm
              for (var layerIndex = layers.length; layerIndex > 0; layerIndex--)
              {
                // curentLayer ref
                var currentLayer = layers[layerIndex-1];
                // currentLayer is a LayerSet
                if (currentLayer.typename == "LayerSet") {
                  goTextExport2(currentLayer, fileOut, path + currentLayer.name + '/');
                // currentLayer is not a LayerSet
                } else {
                  // Layer is visible and Text --> we can haz copy paste!
                  if ( (currentLayer.visible) && (currentLayer.kind == LayerKind.TEXT) )
                  {
                    //fileOut.writeln(separator);
                    fileOut.writeln('');
                    fileOut.writeln('LayerPath: ' + path);
                    fileOut.writeln('LayerName: ' + currentLayer.name);
                    fileOut.writeln('');
                    fileOut.writeln('LayerContent:');
                    fileOut.writeln(currentLayer.textItem.contents);
                    fileOut.writeln('');
                    // additional exports added by Max Glenister for font styles 
                    if(currentLayer.textItem.contents){
                      fileOut.writeln('LayerStyles:');
                      fileOut.writeln('* capitalization: '+(currentLayer.textItem.capitalization=="TextCase.NORMAL"?"normal":"uppercase"));
                      fileOut.writeln('* color: #'+(currentLayer.textItem.color.rgb.hexValue?currentLayer.textItem.color.rgb.hexValue:''));
                      fileOut.writeln('* fauxBold: '+(currentLayer.textItem.fauxBold?currentLayer.textItem.fauxBold:''));
                      fileOut.writeln('* fauxItalic: '+(currentLayer.textItem.fauxItalic?currentLayer.textItem.fauxItalic:''));
                      fileOut.writeln('* font: '+currentLayer.textItem.font);
                      //fileOut.writeln('leading: '+(currentLayer.textItem.leading=='auto-leading'?'auto':currentLayer.textItem.leading));
                      fileOut.writeln('* size: '+currentLayer.textItem.size);
                      fileOut.writeln('* tracking: '+(currentLayer.textItem.fauxItalic?currentLayer.textItem.fauxItalic:''));
                      fileOut.writeln('');
                    }
                  }
                }
              }
            }
          /**
           *  TextExport Boot her up
           * -------------------------------------------------------------
           */
            initTextExport();


     //垂直翻轉
     my_doc.flipCanvas(Direction.VERTICAL); 

     //更改圖層順序
     var newLayer = app.activeDocument.artLayers.add()
     newLayer.name = "new"
     newLayer.move(topLayer, ElementPlacement.PLACEAFTER)

     //留白100 px
     activeDocument.resizeCanvas(UnitValue(my_width,"px"),UnitValue(my_height+100,"px"),AnchorPosition.TOPCENTER); 

     //濾鏡:旋轉效果
     my_layer.applyPolarCoordinates(PolarConversionType.RECTANGULARTOPOLAR);

     //正方形
     my_doc.resizeImage(1000,1000);

     //重新命名，轉存PNG到新資料夾
     var options = new ExportOptionsSaveForWeb();
      options.format = SaveDocumentType.PNG;
         options.PNG8 = false;
         options.interlaced = true;
 
         doc.exportDocument(outputFolder, ExportType.SAVEFORWEB, options);
         //doc.close(SaveOptions.DONOTSAVECHANGES);
         $.writeln('File ' + (i + 1) + ' of ' + files.length + ' processed');


    }
}