<template>
  <div class="feedback-form">
    <h1 class="feedback-form__title">Обратная связь</h1>
    <div class="form-field" :class="{ 'form-field--error': $v.name.$dirty && $v.name.$invalid }">
      <input 
        type="text" 
        class="input" 
        placeholder="Имя"
        @keypress="lettersOnly($event)"
        v-model="$v.name.$model"
      >
    </div>
    <div class="form-field" :class="{ 'form-field--error': $v.surname.$dirty && $v.surname.$invalid }">
      <input 
        type="text" 
        class="input" 
        placeholder="Фамилия"
        @keypress="lettersOnly($event)"
        v-model="$v.surname.$model"
      >
    </div>
    <div class="form-field" :class="{ 'form-field--error': $v.email.$dirty && $v.email.$invalid }">
      <input 
        type="text" 
        class="input" 
        placeholder="Email"
        v-model="$v.email.$model"
      >
    </div>
    <div class="form-field" :class="{ 'form-field--error': $v.phone.$dirty && $v.phone.$invalid }">
      <input 
        type="text" 
        class="input"
        placeholder="Телефон"
        v-model="$v.phone.$model"
        @input="correctPhone"
        v-mask="'+7 ### ### ## ##'"
      >
    </div>
    <div class="form-field">
      <input 
        type="text" 
        class="input"
        placeholder="Дата рождения"
        v-model="bdate"
        v-mask="'##.##.####'"
      >
    </div>
    <div class="form-field form-field--group">
      <span class="form-field__title">Пол:</span>
      <div class="radio">
        <input 
          type="radio" 
          id="male" 
          name="gender" 
          class="radio__input"
          v-model="gender_m"
        >
        <label for="male" class="radio__label">Мужской</label>
      </div>
      <div class="radio">
        <input 
          type="radio" 
          id="female" 
          name="gender" 
          class="radio__input"
          v-model="gender_w"
        >
        <label for="female" class="radio__label">Женский</label>
      </div>
    </div>
    <div class="form-field">
      <div class="checkbox">
        <input 
          type="checkbox" 
          id="agreement" 
          class="checkbox__input"
          v-model="argeement"
        >
        <label for="agreement" class="checkbox__label">Согласен на <a href="#" class="checkbox__label-link">обработку персональных данных</a></label>
      </div>
    </div>
    <button 
      class="button" 
      :class="{ 'button--disabled': isSubmitClicked }" 
      @click="submitForm"
    >Отправить</button>
    <span class="feedback-form__message" v-if="isSubmitted">Заявка отправлена!</span>
  </div>
</template>

<script>
import {required, email, minLength} from 'vuelidate/lib/validators';

import * as Api from '../js/api'
let api = Api.getInstance();

export default {
  name: 'feedback-form',
  data: () => {
    return {
      name: null,
      surname: null,
      email: null,
      phone: null,
      bdate: null,
      gender_m: false,
      gender_w: false,
      argeement: true,
      isSubmitClicked: false,
      isSubmitted: false
    }
  },
  validations() {
    return {
      name: {required},
      surname: {required},
      email: {
        required,
        email
      },
      phone: {
        required,
        minLength: minLength(16)
      },
    }
  },
  methods: {
    lettersOnly(e) {
      let charCode = e.keyCode
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode > 1039 && charCode < 1106) || charCode == 8 || charCode == 45)
        return true
      else 
        e.preventDefault()
    },
    correctPhone() {
      if (this.phone[3] == 8 || this.phone[3] == 7) {
        this.phone = '+7 '
      }
    },
    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid || this.isSubmitClicked || !this.argeement) {
        return;
      }

      this.isSubmitClicked = true;

      let formData = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        bdate: this.bdate,
        gender: this.gender_m ? 'мужской' : 'женский',
        argeement: this.argeement
      }

      api.setFormData(formData)
      .then(() => {
        this.isSubmitClicked = false;
        this.isSubmitted = true;
      })
    }
  }
}
</script>