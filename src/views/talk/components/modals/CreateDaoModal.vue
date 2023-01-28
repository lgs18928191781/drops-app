<template>
  <FullScreenModal
    v-model:show-control="layout[ShowControl.isShowCreateDaoModal]"
    :extra-close-event="form.reset()"
  >
    <template #title>
      <div>
        Create the club's DAO
      </div>
    </template>

    <template #body>
      <div class="h-full w-full overflow-y-auto p-6">
        <div class="lg:flex flex-col space-y-6 lg:space-y-8 w-full place-items-stretch pb-12">
          <h3 class="w-full text-lg font-bold">Profile</h3>

          <!-- Icon -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Icon</h4>
            <div class="col-span-4">
              <Image
                :src="(talk.activeCommunity?.icon as string)"
                custom-class="w-20 h-20 rounded-full"
              />
            </div>
          </div>

          <!-- Name -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Name</h4>
            <div class="col-span-4">
              <div class="prefill-field">
                {{ `${talk.activeCommunity?.name || 'Club'}'s Official DAO` }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Description</h4>
            <div class="col-span-4">
              <textarea
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="Describe what your DAO is about?"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Mission -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Mission</h4>
            <div class="col-span-4">
              <textarea
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="What's the goal of your DAO?"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Categories -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Categories</h4>
            <div class="col-span-4">
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="category in categories"
                  :key="category"
                  class="flex items-center gap-2 px-4 py-1.5 rounded-full transition duration-200 cursor-pointer"
                  :class="[
                    form.categories.includes(category)
                      ? 'bg-primary text-dark-800'
                      : 'bg-dark-200 dark:bg-gray-950 text-dark-300',
                  ]"
                  @click="form.switchCategory(category)"
                >
                  <span class="text-sm capitalize">{{ category }}</span>
                  <Icon name="check" class="w-4 h-4" v-if="form.categories.includes(category)" />
                  <div
                    class="w-4 h-4 shadow-inner shadow-gray-300 dark:shadow-blue-200/20 rounded"
                    v-else
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Website -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Website</h4>
            <div class="col-span-4">
              <input
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="e.g. https://metabot.world"
              />
            </div>
          </div>

          <!-- Terms -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Terms</h4>
            <div class="col-span-4">
              <input
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="e.g. https://metabot.world/terms"
              />
            </div>
          </div>

          <!-- Social Header -->
          <h3
            class="w-full text-lg font-bold pt-12 !mt-12 border-t-2 border-solid border-dark-200 dark:border-gray-700"
          >
            Social
          </h3>

          <!-- Twitter -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Twitter</h4>
            <div class="col-span-4">
              <input
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="If you have an official Twitter account, enter it here."
              />
            </div>
          </div>

          <!-- Discord -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Discord</h4>
            <div class="col-span-4">
              <input
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="...and Discord, "
              />
            </div>
          </div>

          <!-- Telegram -->
          <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
            <h4 class="field-label col-span-1">Telegram</h4>
            <div class="col-span-4">
              <input
                type="text"
                class="main-border faded-switch still field-input resize-none"
                placeholder="...and Telegram too. "
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </FullScreenModal>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { useMutateDaoFormStore } from '@/stores/forms'
import FullScreenModal from './FullScreenModal.vue'
import { ShowControl } from '@/enum'
import { useTalkStore } from '@/stores/talk'

const layout = useLayoutStore()
const talk = useTalkStore()
const form = useMutateDaoFormStore()

const fields = [
  {
    label: 'Name',
    value: `${talk.activeCommunity?.name || 'Club'}'s Official DAO`,
    prefilled: true,
    key: 'name',
  },
  {
    label: 'Description',
    value: '',
    prefilled: false,
    key: 'description',
    placeholder: "Describe what your DAO's about",
  },
  {
    label: 'Cover',
    value: '',
    prefilled: false,
    key: 'cover',
  },
]

const categories = ['protocol', 'service', 'social', 'investment', 'grant', 'collector', 'culture']
</script>

<style lang="css" scoped>
.field-label {
  @apply text-sm capitalize flex items-start justify-start font-bold;
}

.prefill-field {
  @apply text-base font-bold;
}

.field-input {
  @apply outline-0 !bg-white dark:!bg-gray-700 w-full px-4 py-2 text-base leading-[24PX] placeholder:font-normal;
}
</style>
