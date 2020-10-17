import * as yup from 'yup'

export const validShape = yup.object().shape({
  username: yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Обязательное поле'),
  password: yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Обязательное поле'),
   // email: yup.string().email('Invalid email').required('Required'),
})

