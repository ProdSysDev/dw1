<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <h2 class="text-center font-weight-lighter mb-5">
            Invite User
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" offset-md="3">
          <error-alert />
          <b-form @submit="doAdd">
            <b-form-row>
              <b-col>
                <b-form-group label="Title:">
                  <b-form-select
                    v-model="$v.request.request.title.$model"
                    :state="isInvalid($v.request.request.title)"
                    :options="titleOptions"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Name:">
                  <b-form-input v-model="$v.request.request.name.$model" :state="isInvalid($v.request.request.name)" />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Surname:">
                  <b-form-input
                    v-model="$v.request.request.surname.$model"
                    :state="isInvalid($v.request.request.surname)"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Email:">
                  <b-form-input
                    v-model="$v.request.request.email.$model"
                    :state="isInvalid($v.request.request.email)"
                    type="email"
                  />
                  <b-form-invalid-feedback>This field is required and must be a valid email.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Company Position:">
                  <b-form-input
                    v-model="$v.request.request.companyPosition.$model"
                    :state="isInvalid($v.request.request.companyPosition)"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="MOBILE NUMBER:">
                  <vue-phone-number-input
                    v-model="rootMobileNumber"
                    @update="phoneUpdate"
                    :only-countries="mobileCountries"
                    :border-radius="0"
                    :error="numberIsValid === false"
                    color="#6C1C5C"
                    error-color="#F50E4C"
                    valid-color="#6D7490"
                    default-country-code="GB"
                  />
                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                    This field must be a valid mobile number.
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <loader-button :is-loading="isLoading" button-text="send invite" class="mt-5 text-center" />
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { email, maxLength, required } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'
import { CorporateUserType } from '~/api/Enums/Corporates/CorporateUserType'
import { CreateCorporateUserFullRequest } from '~/api/Requests/Corporates/CreateCorporateUserFullRequest'

const Corporates = namespace(CorporatesStore.name)
const Auth = namespace(AuthStore.name)
const Countries = require('~/static/json/countries.json')

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
      request: {
        name: {
          required,
          maxLength: maxLength(100)
        },
        surname: {
          required,
          maxLength: maxLength(100)
        },
        title: {
          required
        },
        email: {
          required,
          email
        },
        companyPosition: {
          required
        },
        mobileCountryCode: {},
        mobileNumber: {}
      }
    }
  }
})
export default class AddCardPage extends VueWithRouter {
  @Corporates.Getter isLoading

  @Auth.Getter identityId

  rootMobileNumber = ''

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  titleOptions = [
    { value: null, text: 'Mr / Ms / Mrs', disabled: true },
    { value: 'Mr', text: 'Mr' },
    { value: 'Mrs', text: 'Mrs' },
    { value: 'Ms', text: 'Ms' }
  ]

  public request: CreateCorporateUserFullRequest = {
    corporateId: '0',
    request: {
      type: CorporateUserType.USER,
      title: null,
      name: '',
      surname: '',
      email: '',
      active: true,
      companyPosition: '',
      mobileCountryCode: '',
      mobileNumber: ''
    }
  }

  doAdd(evt) {
    evt.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError || !this.numberIsValid) {
        return null
      }
    }

    CorporatesStore.Helpers.addUser(this.$store, this.request).then(this.userAdded.bind(this))
  }

  userAdded() {
    this.$router.push('/users')
  }

  mounted() {
    this.request.corporateId = this.identityId
  }

  numberIsValid: boolean | null = null

  phoneUpdate(number) {
    this.request.request.mobileCountryCode = '+' + number.countryCallingCode
    this.request.request.mobileNumber = number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>
