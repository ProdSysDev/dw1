<template>
  <section>
    <b-container>
      <b-row v-if="!sumsSubEnabled">
        <b-col md="6" offset-md="3" class="py-5 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
            We are required by financial services regulations to perform due diligence on your company before allowing
            you to transact with your account.
          </p>
          <p>
            Kindly prepare to submit and upload the following documents:
          </p>
          <ul class="my-3 font-weight-normal">
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association (last amendment)</li>
            <li>Proof of Business Address (e.g. lease agreement)</li>
            <li>UBO Declaration Form downloadable from <a href="https://storage.cloud.google.com/weavr-cdn/UBO-a.pdf">here.</a></li>
            <li>Commercial registry extract showing shareholders and directors</a></li>
          </ul>
          <p>
            You will also need to provide the following information:
          </p>
          <ul class="my-3 font-weight-normal">
            <li>Directors: name, date of birth, nationality, email address, contact number</li>
            <li>Ultimate Beneficiary Owners (UBOs) holding a stake of 25% or more: name, date of birth, nationality</li>
          </ul>
          <div class="text-center">
            <b-button to="/managed-accounts/kyb">
              start the verification process
            </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <weavr-kyb
            :corporate-id="corporateId"
            :access-token="accessToken"
            :options="kybOptions"
            @message="handleSumSubMessage"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as CorporatesStore from '~/store/modules/Corporates'
import config from '~/config'
import { KYBOptions } from '~/plugins/weavr/components/api'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class KybPage extends VueWithRouter {
  accessToken!: string
  corporateId!: string

  get kybOptions(): KYBOptions {
    return {
      customCss:
        "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam:wght@300;400;500&display=swap');\n\np{ color: #25262B; font-family: 'Be Vietnam', sans-serif;} ul{ column-count: 1; color: #25262B; font-family: 'Be Vietnam', sans-serif; } ul li{ color: #25262B; margin-bottom: 5px; } h4 p, h2, h3.subtitle p{ font-size: 15px; font-weight: 300; margin: 30px 0;} .input-field span, .radio-group span{ text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Be Vietnam', sans-serif; font-weight:500; color: #25262B; } input, select, textarea{ font-family: 'Be Vietnam', sans-serif; height:30px; border-width: 1px; font-size:18px; font-weight: 400; color: #232A47; } input:focus, select:focus, textarea:focus{ border-bottom-color: #D621B2; } input-field{ position:relative;} .input-field span, .radio-group span{ position:absolute; top: 0; height: 20px; } .fields-list.fields-list-two-columns .input-field{ padding-top: 24px; min-height: 40px;} .list li[data-v-044267ea]{ font-family: 'Be Vietnam', sans-serif; color: #25262B; } .flag{ margin-right: 5px;} .upload-item h4{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .sub-steps .sub-step.active{ color: #3CF7CA; } .sub-steps .sub-step{ width: 12px; height: 12px; } button.submit, button[type=submit]{ background: #3CF7CA; text-transform: lowercase; color: #6C1C5C; font-family: 'Be Vietnam', sans-serif; font-weight: 400; font-size: 15px; letter-spacing: 0;} .mobile-button h3{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; font-weight: 500; } .upload-item p{ font-size: 12px; } .mobile-button .fa-icon{ color: #6C1C5C; } .mobile-button h4{ color: #6D7490; font-family: 'Be Vietnam', sans-serif;} button.submit:active:not(:disabled), button.submit:hover:not(:disabled):not(.disabled):not(:active), button[type=submit]:active:not(:disabled), button[type=submit]:hover:not(:disabled):not(.disabled):not(:active){ background: #3CF7CA;} button.submit .arrow, button[type=submit] .arrow{ height: 28px; } .checkbox, .radio-item{ font-family: 'Be Vietnam', sans-serif; color: #232A47; } h4{ font-family: 'Be Vietnam', sans-serif; color: #25262B;} a.payment-method-add{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } a.payment-method-add:hover{ text-decoration: none; } a.payment-method-add .icon{ background: #3CF7CA; width: 38px; height: 38px; } h4.subtitle p{ font-size: 15px; font-weight: 400; color: #6D7490; } h2.uppercase p{ font-weight: 500; } .beneficial-buttons a{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .error-message .message-content, .error-message .message-title{ font-family: 'Be Vietnam', sans-serif; } .error-message .message-title{ letter-spacing: 0.05em; } .payment-method-data h2{ font-family: 'Be Vietnam', sans-serif; color: #232A47; font-size: 15px; font-weight: 400; } .sub-steps .sub-step.pending{ background: #6C1C5C; }"
    }
  }

  get sumsSubEnabled() {
    return config.app.sumsub_enabled
  }

  async asyncData({ store }) {
    const _corproateid = AuthStore.Helpers.identityId(store)

    if (config.app.sumsub_enabled) {
      try {
        const _res = await CorporatesStore.Helpers.startKYB(store, _corproateid)

        return { accessToken: _res.data.accessToken, corporateId: _corproateid }
      } catch (e) {
        console.log(e)
      }
    }
  }

  handleSumSubMessage(message) {
    console.log(message)
  }
}
</script>
<style lang="scss" scoped>
ol {
  margin: 0;
  padding: 0;
  list-style-position: inside;

  li {
    margin: 0;
    padding: 16px 0;
    border-top: 1px solid #eaedf6;

    &:last-child {
      border-bottom: 1px solid #eaedf6;
    }
  }
}
</style>
