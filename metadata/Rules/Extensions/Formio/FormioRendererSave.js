export default function FormioRendererSave (context) {
    // Well, not good to access private direcltly but MDK do not have method to get into custom plugin control????
    return context.getControl("FormioRendererControl")._control.submitForm();
}