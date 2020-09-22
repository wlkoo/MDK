import { FormioLibrary as formioLibrary} from './FormioLibrary';

export default function FormioGenerateRandomUuid(context) {
	let uuid = context.binding.FormioUuid;
	if(!uuid) {
		uuid = formioLibrary.getNewUuid();
		context.binding.FormioUuid = uuid;
	}
	return uuid;
}