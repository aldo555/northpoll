<template>
  <div class="p-4 sm:p-12 md:p-16 flex flex-col items-center min-h-screen bg-gray-50">
    <Logo class="pb-4 pt-4 sm:pt-0" />
    <p v-if="!lastPollCreated" class="max-w-5xl w-full break-words text-xl sm:text-2xl py-4 sm:py-8 text-gray-600 whitespace-pre-line">{{ guide }}</p>
    <p v-else class="max-w-5xl w-full break-words text-xl sm:text-2xl py-4 sm:py-8 text-gray-600 whitespace-pre-line">
      Nice work! Now <span @click="sharePoll" class="text-teal-500 font-medium underline cursor-pointer hover:text-teal-400 transition ease-in-out duration-150">click here to share the poll</span> to your imaginary friends.
      <br />
      Also, make sure you get at least one <span @click="voteOnPoll" class="text-teal-500 font-medium underline cursor-pointer hover:text-teal-400 transition ease-in-out duration-150">vote on this poll</span>.
    </p>
    <div class="max-w-5xl w-full bg-white overflow-hidden shadow-lg rounded-md">
      <label for="question" class="sr-only">Question</label>
      <div class="relative rounded-md">
        <TextareaAutosize
          rows="1"
          placeholder="What's the one thing you're particularly good at?"
          class="form-textarea block w-full transition duration-150 ease-in-out rounded-none border-none px-6 py-4 text-xl md:text-2xl focus:shadow-none focus:outline-none placeholder-teal-400 text-teal-500"
          ref="title"
          v-model="title"
          :disabled="lastPollCreated"
          :min-height="10"
          :max-height="350"
          @keydown.native="switchToOptions"
        />
      </div>
      <transition-group
        tag="div"
        enter-active-class="transition ease-out duration-200"
        enter-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-for="(option, index) in options" :key="index" class="relative">
          <input
            :ref="`option-${index}`"
            @focus="updateNumberOfOptions(index)"
            @keydown="nextOption(index)"
            v-model="options[index]"
            :disabled="lastPollCreated"
            :class="{ 'bg-gray-100' : index % 2 !== 1 }"
            class="form-input block w-full rounded-none border-none focus:outline-none focus:shadow-none text-lg pl-6 pr-10 py-3 text-gray-800"
            placeholder="nothing"
          >
          <div @click="deleteOption(index)" v-if="!lastPollCreated && (index > 1 || (options.length > 2 && index > 0))" class="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer text-gray-600 hover:text-gray-500 transition ease-in-out duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </transition-group>
    </div>
    <div v-if="!lastPollCreated" class="md:max-w-5xl w-full self-center inline-flex py-8 sm:py-12 justify-between">
      <button @click="createPoll" type="button" class="inline-flex items-center justify-center px-6 py-3 shadow-md border border-transparent text-base leading-6 font-medium rounded-md text-white  bg-teal-500 hover:bg-teal-400 focus:outline-none focus:border-teal-600 focus:shadow-outline-teal active:bg-teal-600 transition ease-in-out duration-150">
        Create poll
      </button>
      <button v-if="!currentProfile" @click="profileModalState = true" type="button" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base leading-6 font-medium rounded-md text-teal-700 bg-white hover:text-teal-500 focus:outline-none focus:border-teal-300 focus:shadow-outline-teal active:text-teal-800 active:bg-teal-50 transition ease-in-out duration-150">
        Create profile
      </button>
      <p v-else class="text-teal-500">Profile - {{ currentProfile.name }}</p>
    </div>

    <div v-else class="max-w-5xl w-full self-center inline-flex py-8 sm:py-12 justify-start">
      <button @click="viewResults" type="button" class="mr-3 inline-flex items-center justify-center px-6 py-3 shadow-md border border-transparent text-base leading-6 font-medium rounded-md text-white  bg-teal-500 hover:bg-teal-400 focus:outline-none focus:border-teal-600 focus:shadow-outline-teal active:bg-teal-600 transition ease-in-out duration-150">
        View results
      </button>
      <button @click="createNewPoll" type="button" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base leading-6 font-medium rounded-md text-teal-700 bg-white hover:text-teal-500 focus:outline-none focus:border-teal-300 focus:shadow-outline-teal active:text-teal-800 active:bg-teal-50 transition ease-in-out duration-150">
        Create new poll
      </button>
    </div>

    <Modal :state="profileModalState" @close="profileModalState = false" @confirm="createProfile()" type="success">
      <h1 slot="header">
        Create a profile
      </h1>

      <div class="text-left">
        <label for="email" class="block text-sm font-medium leading-5 text-gray-700">Name</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input v-model="profileName" id="email" class="form-input block w-full sm:text-sm sm:leading-5" placeholder="John Doe">
        </div>
      </div>

      <span slot="button">
        Create
      </span>
    </Modal>
  </div>
</template>

<script>
import Logo from '@/components/Logo'
import Modal from '@/components/Modal'
import Poll from '@/api/Poll'
import Profile from '@/api/Profile'

export default {
  name: 'Create',
  components: {
    Logo,
    Modal,
  },
  data () {
    return {
      title: '',
      options: ['', ''],
      lastPollCreated: null,
      profileModalState: false,
      profileName: '',
      currentProfile: null
    }
  },
  computed: {
    guide () {
      if (this.options.filter(title => title.length).length && !this.title) {
        return 'Let\'s not get ahead of ourselves, maybe filling in the question would be a good idea.'
      } else if (this.options.filter(title => title.length).length > 1) {
        return 'Great work, you don\'t need a college degree to figure out the rest.'
      } else if (this.options.filter(title => title.length).length === 1) {
        return 'You\'re a natural, now make up at least another answer and you\'re set.'
      } else if (this.title.length) {
        return 'It seems like we\'re making progress. When you\'re done, get down to the answers.'
      }

      return 'Hey there, bud! Fill in the question below and start creating your poll. \n We made up a totally random question to stimulate your creative juices.'
    },
  },
  methods: {
    updateNumberOfOptions (index) {
      if (index + 1 === this.options.length) {
        this.$set(this.options, index + 1, '')
      }
    },
    switchToOptions () {
      if (event.keyCode === 40) {
        this.$refs['title'].resize()
        this.$refs['option-0'][0].focus()
      } else if (event.keyCode === 13) {
        this.$refs['option-0'][0].focus()
        setTimeout(() => {
          this.$refs['option-0'][0].setSelectionRange(this.options[0].length, this.options[0].length)
        }, 1)
      }
    },
    nextOption (index) {
      if (event.keyCode === 38 && index > 0) {
        this.$refs[`option-${index - 1}`][0].focus()
        setTimeout(() => {
          this.$refs[`option-${index - 1}`][0].setSelectionRange(this.options[index - 1].length, this.options[index - 1].length)
        }, 1)
      } else if ((event.keyCode === 40 || event.keyCode === 13) && index < this.options.length) {
        this.$refs[`option-${index + 1}`][0].focus()
      } else if (event.keyCode == 38 && index === 0) {
        this.$refs['title'].$el.focus()
        setTimeout(() => {
          this.$refs['title'].$el.setSelectionRange(this.title.length, this.title.length)
        }, 1)
      } else if (event.keyCode === 8 && index > 0 && !this.options[index]) {
        event.preventDefault()
        event.stopPropagation()
        this.$refs[`option-${index - 1}`][0].focus()
        setTimeout(() => {
          this.$refs[`option-${index - 1}`][0].setSelectionRange(this.options[index - 1].length, this.options[index - 1].length)
        }, 1)
        this.deleteOption(index)
      }
    },
    deleteOption (index) {
      if (this.options.length > 2) {
        this.options.splice(index, 1)
      }
    },
    createPoll () {
      if (!this.title) {
        this.$notify({
          type: 'error',
          title: 'Oopsie',
          text: 'I was not joking about filling in the question.',
        })
        return
      }

      if (this.options.filter(title => title.length).length < 2) {
        this.$notify({
          type: 'error',
          title: 'Oopsie',
          text: 'Filling in some options surely can\'t make your poll any worse.',
        })
        return
      }

      Poll.store({
        title: this.title,
        options: this.options.filter(option => option).map((option) => {
          return { title: option }
        })
      }).then(response => {
        this.$notify({
          type: 'success',
          title: 'Goodie',
          text: response.data.message,
        })

        localStorage.poll = response.data.poll
        this.lastPollCreated = response.data.poll
        this.showLastPollCreated()
      })
    },
    showLastPollCreated () {
      if (!localStorage.poll) {
        return
      }

      this.lastPollCreated = localStorage.poll

      Poll.view(this.lastPollCreated).then(response => {
        this.title= response.data.poll.title
        this.options = []
        response.data.poll.options.forEach(option => {
          this.options.push(option.title)
        })
      })
    },
    sharePoll () {
      const el = document.createElement('textarea')
      el.value = window.location.origin + this.$router.resolve({name: 'Vote', params: {poll: this.lastPollCreated}}).href
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
    voteOnPoll () {
      this.$router.push({name: 'Vote', params: {poll: this.lastPollCreated}})
    },
    createNewPoll () {
      localStorage.removeItem('poll')
      this.title = ''
      this.options = ['', '']
      this.lastPollCreated = null
    },
    viewResults () {
      if (!this.lastPollCreated) {
        return
      }

      this.$router.push({ name: 'Results', params: { poll: this.lastPollCreated } })
    },
    createProfile () {
      Profile.store({name: this.profileName}).then(response => {
        this.$notify({
          type: 'success',
          title: 'Goodie',
          text: response.data.message,
        })

        this.profileModalState = false
        localStorage.profile = JSON.stringify(response.data.profile)
        this.currentProfile = response.data.profile
      })
    }
  },
  mounted () {
    if (localStorage.profile) {
      this.currentProfile = JSON.parse(localStorage.profile)
    }

    this.showLastPollCreated()

    this.$refs['title'].$el.focus()
  }
}
</script>
