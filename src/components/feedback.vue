<template>
  <div class="feedback">
    <div class="feedback__inner">
      <feedback-form></feedback-form>
    </div>
  </div>
</template>

<script>
import FeedbackForm from './feedback-form.vue'

export default {
  name: 'feedback',
  components: {
    FeedbackForm
  },
}
</script>