export default function FormioGetData(context) {
   let binaryData = [{
      "content": context.binding.FormioData,
      "contentType": "Text"
   }];

   return binaryData;
}