<template>
  <b-form-group class="mb-0">
    <b-button v-if="!isLoading" type="submit" variant="secondary">
      {{ buttonText }}
      <span v-if="showArrow" class="pl-5">-></span>
    </b-button>
    <b-button v-if="isLoading" disabled variant="secondary">
      <b-spinner small type="grow" />
    </b-button>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
class LoaderButton extends Vue {
  @Prop({ default: false }) isLoading!: boolean
  @Prop({ default: true }) showArrow!: boolean

  @Prop({ default: 'Button Text' }) buttonText!: string
}

export default LoaderButton
</script>
