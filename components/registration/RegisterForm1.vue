<template>
  <b-form @submit="tryToSubmitForm">
    <h3 class="text-center font-weight-light mb-5">
      Register
    </h3>
    <error-alert />
    <b-form-group :state="isInvalid($v.form.rootEmail)" label="Email">
      <b-form-input
        v-model="$v.form.rootEmail.$model"
        :state="isInvalid($v.form.rootEmail)"
        placeholder="name@email.com"
      />
      <b-form-invalid-feedback>Email address invalid.</b-form-invalid-feedback>
    </b-form-group>
    <client-only placeholder="Loading...">
      <weavr-form ref="passwordForm" :class="{ 'is-dirty': $v.form.$dirty }">
        <label class="d-block">PASSWORD</label>
        <weavr-input
          :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
          :base-style="passwordBaseStyle"
          @onKeyUp="checkOnKeyUp"
          class-name="sign-in-password"
          name="password"
          field="password"
          required="true"
        />
        <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
      </weavr-form>
    </client-only>
    <b-form-row class="small mt-3 text-muted">
      <b-col>
        <b-form-group>
          <b-form-checkbox v-model="$v.form.acceptedTerms.$model" :state="isInvalid($v.form.acceptedTerms)">
            I accept the <a href="https://www.onvirtual.cards/terms/business" target="_blank" class="text-decoration-underline text-muted">terms of use</a> and <a href="https://www.onvirtual.cards/policy/" target="_blank" class="text-decoration-underline text-muted">privacy policy</a>
          </b-form-checkbox>
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <b-button variant="secondary" type="submit">
          continue
          <span class="pl-5">-></span>
        </b-button>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, Ref } from 'nuxt-property-decorator'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'
import * as AuthStore from '~/store/modules/Auth'
import * as ErrorStore from '~/store/modules/Error'
import { ValidatePasswordRequest } from '~/api/Requests/Auth/ValidatePasswordRequest'
import config from '~/config'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import * as SecureClientStore from '~/store/modules/SecureClient'

@Component({
  validations: {
    form: {
      rootEmail: {
        required,
        email
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true)
      }
    }
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue')
  }
})
export default class RegisterForm1 extends VueWithRouter {
  public form: {
    rootEmail: string
    password: string
    acceptedTerms: boolean
  } = {
    rootEmail: '',
    password: '',
    acceptedTerms: false
  }

  tryToSubmitForm(e) {
    e.preventDefault()

    console.log('submit form checking validation')
    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        console.log(this.$v.form)
        return null
      }
    }

    console.log('submit form validation success')

    SecureClientStore.Helpers.tokenize(this.$store).then(
      (tokens) => {
        console.log('password tokenisation')
        if (tokens.password !== '') {
          this.form.password = tokens.password

          this.validatePassword()
        } else {
          return null
        }
      },
      (e) => {
        console.log('tokenisation failed', e)
      }
    )
  }

  validatePassword() {
    console.log('password  validation')
    const _request: ValidatePasswordRequest = {
      identityProfileId: config.profileId.corporates ? config.profileId.corporates : '',
      credentialType: 'ROOT',
      password: {
        value: this.form.password
      }
    }

    AuthStore.Helpers.validatePassword(this.$store, _request).then(this.submitForm.bind(this))
  }

  @Emit()
  submitForm() {
    console.log('form success')
    ErrorStore.Helpers.resetErrors(this.$store)
    return this.form
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.tryToSubmitForm(e)
    }
  }

  get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
    return {
      color: '#495057',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      fontFamily: "'Be Vietnam', sans-serif",
      fontWeight: '400',
      lineHeight: '24px',
      margin: '0',
      padding: '6px 12px',
      textIndent: '0px',
      '::placeholder': {
        color: '#B6B9C7',
        fontWeight: '400'
      }
    }
  }
}
</script>
