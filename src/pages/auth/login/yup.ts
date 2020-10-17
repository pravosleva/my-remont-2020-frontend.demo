import * as yup from 'yup'

export const validShape = yup.object().shape({
  password: yup.string().required('Обязательное поле'),
  // email: yup.string().email('Invalid email').required('Required'),
})
