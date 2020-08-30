<template>
  <div class="p-4 sm:p-12 md:p-16 flex flex-col items-center min-h-screen bg-gray-50">
    <Logo class="pb-4 pt-4 sm:pt-0" />
    <p class="max-w-5xl w-full break-words text-xl sm:text-2xl py-4 sm:py-8 text-gray-600 whitespace-pre-line">
      Question. Answers. Thumbs up. You can make the connection.
    </p>
    <div v-if="poll" class="max-w-5xl my-4 w-full bg-white overflow-hidden shadow-lg rounded-md">
      <label for="question" class="sr-only">Question</label>
      <div class="relative rounded-md">
        <div class="bg-teal-600 transition duration-150 ease-in-out px-6 py-4 text-4xl text-white">
          {{ poll.title }}
        </div>
      </div>

      <div @click="vote(index)" v-for="(option, index) in poll.options" :key="index" :class="{ 'bg-gray-100' : (index + 1) % 2 === 0 }" class="flex justify-between w-full rounded-none border-none text-xl px-6 py-4 text-gray-800">
        <span>{{ option.title }}</span>
        <div class="flex items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500 hover:text-teal-400 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo'
import Poll from '@/api/Poll'

export default {
  name: 'Vote',
  components: {
    Logo,
  },
  data () {
    return {
      poll: null
    }
  },
  methods: {
    vote (index) {
      Poll.vote(this.poll.options[index].id).then(response => {
        this.$notify({
          type: 'success',
          title: 'Goodie',
          text: response.data.message,
        })
        this.$router.push({ name: 'Results', params: { poll: this.poll.slug } })
      })
    }
  },
  mounted () {
    Poll.view(this.$route.params.poll).then(response => {
      if (response.data.message) {
        this.$notify({
          type: 'warn',
          title: 'Oopsie',
          text: response.data.message,
        })

        this.$router.push({ name: 'Results', params: { poll: response.data.poll.slug } })

        return
      }

      this.poll = response.data.poll
    })
  }
}
</script>
