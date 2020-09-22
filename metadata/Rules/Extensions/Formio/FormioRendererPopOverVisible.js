export default function FormioRendererPopOverVisible (context) {
    return context.binding.FormioAction === "Display" ? false : true;
}