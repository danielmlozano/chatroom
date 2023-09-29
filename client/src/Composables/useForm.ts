import { reactive } from "vue"

const baseUrl = (import.meta as any).env.VITE_API_URL as string

/**
 * Represents the form object.
 */
interface Form<T> {
	/**
	 * The data of the form.
	 */
	data: T

	/**
	 * The errors of the form.
	 */
	errors: FormErrors

	/**
	 * Indicates whether the form is being processed.
	 */
	processing: boolean

	/**
	 * Resets the form to its initial values.
	 */
	reset: () => void

	/**
	 * Submits the form to the specified URL using the specified method.
	 * @param url The URL to submit the form to.
	 * @param method The HTTP method to use. Defaults to "post".
	 */
	submit: (url: string, method?: string) => Promise<void>

	[key: string]: any
}

/**
 * Represents the initial values of the form.
 */
interface FormState {
	[key: string]: any
}

/**
 * Represents the errors of the form.
 */
interface FormErrors {
	[key: string]: string[]
}

/**
 * Creates a new form object with the specified initial values.
 * @param initialValues The initial values of the form.
 * @returns The form object.
 */
const useForm = <T extends FormState>(initialValues: T): Form<T> => {
	const state = reactive<FormState>({
		data: initialValues,
		errors: {} as FormErrors,
		processing: false,
	})

	const reset = () => {
		state.data = initialValues
		state.errors = {}
	}

	const submit = async (url: string, method: string = "post") => {
		state.processing = true

		try {
			const response = await fetch(`${baseUrl}${url}`, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(state.data),
			})

			if (!response.ok) {
				const { errors } = await response.json()
				state.errors = errors
				throw new Error("Form submission failed")
			}

			state.errors = {}
		} catch (error) {
			console.error(error)
		} finally {
			state.processing = false
		}
	}

	return {
		data: state.data,
		errors: state.errors,
		processing: state.processing,
		reset,
		submit,
	}
}

const apiFetch = async (url: string, data?: any) => {
	const response = await fetch(`${baseUrl}${url}`, {
		method: "get",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const { errors } = await response.json()
		throw new Error(errors)
	}

	return response.json()
}

export { useForm, apiFetch }
