<template>
  <div class="p-4 sm:p-12 md:p-16 flex flex-col items-center min-h-screen bg-gray-50">
    <Logo class="pb-4 pt-4 sm:pt-0" />
    <p v-if="poll" class="max-w-5xl w-full break-words text-xl sm:text-2xl py-4 sm:py-8 text-gray-600 whitespace-pre-line">
      Got friends? Who are we kidding. Just share <span @click="sharePoll" class="text-teal-500 font-medium underline cursor-pointer hover:text-teal-400 transition ease-in-out duration-150">this link</span> with your parents.
    </p>
    <div v-if="poll" class="max-w-5xl my-4 w-full bg-white overflow-hidden shadow-lg rounded-md">
      <label for="question" class="sr-only">Question</label>
      <div class="relative rounded-md">
        <div class="bg-teal-600 transition duration-150 ease-in-out px-6 py-4 text-4xl text-white">
          {{ poll.title }}
        </div>
      </div>

      <div v-for="(option, index) in poll.results" :key="index" class="flex flex-col w-full rounded-none border-none text-gray-800">
        <div class="px-6 py-4">
          <div class="font-medium flex flex-row items-center">
            <span class="pr-2 text-lg">{{ option.title }}</span>
            <span class="text-sm font-normal whitespace-no-wrap">{{ option.votes }} {{ option.votes === 1 ? 'vote' : 'votes' }}</span>
          </div>
        </div>
        <!-- <div class="w-full bg-gray-400 relative">
          <span class="absolute px-6 py-1 text-white text-xl">{{ option.percentage.toFixed(2) }}%</span>
          <div :style="{ width: `${option.percentage.toFixed(2)}%` }" class="h-10 bg-teal-500"></div>
        </div> -->
        <div class="w-full bg-gray-400">
          <div :style="{ 'max-width' : `${option.percentage.toFixed(2)}%` }" class="bg-teal-500 pr-2 py-1 text-right text-white text-xl transition ease-in-out duration-150">
            <span class="ml-6">{{ option.percentage.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo'
import Poll from '@/api/Poll'

export default {
  name: 'Results',
  components: {
    Logo,
  },
  data () {
    return {
      poll: null,
      polling: null,
    }
  },
  methods: {
    sharePoll () {
      const el = document.createElement('textarea')
      el.value = window.location.origin + this.$router.resolve({name: 'Vote', params: {poll: this.poll.id}}).href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      this.$notify({
          type: 'success',
          title: 'Goodie',
          text: 'Poll link copied to clipboard.',
        })
    },
    getResults () {
      Poll.results(this.$route.params.poll).then(response => {
        this.poll = response.data.poll
      })
    },
    pollResults () {
      this.polling = setInterval(() => {
          this.getResults()
          console.log('polling')
      }, 10000)
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  created () {
    this.getResults()
    this.pollResults()
  }
}
</script>
