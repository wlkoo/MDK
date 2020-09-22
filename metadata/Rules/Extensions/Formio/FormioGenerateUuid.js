import { FormioLibrary as formioLibrary} from './FormioLibrary';

export default function FormioGenerateUuid(context) {
	return formioLibrary.getNewUuid();
}