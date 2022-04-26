import React from 'react'
import { Listing } from './components/Listing'
import styles from './NoNameSection2.module.scss'

export const NoNameSection2 = () => {
  return (
    <div className={styles['bg-image']}>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <p>
            Мы создаем новую веленную неосознанного потребления с целью заработка, заботясь исключительно о личной
            выгоде, за счет расходов наших клиентов на современные гаджеты.
          </p>
          <p>Здесь должен быть еще один абзац.</p>
          <p>SomeShit – Trade-in оператор №1 в России и СНГ.</p>
        </div>
        <Listing />
      </div>
    </div>
  )
}
