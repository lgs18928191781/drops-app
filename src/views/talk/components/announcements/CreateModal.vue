<template>
  <TransitionRoot :show="show">
    <Dialog @close="emit('close')" class="relative z-50 text-dark-800 dark:text-gray-100">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex h-full overflow-y-hidden lg:h-auto lg:min-h-full items-center justify-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-75"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-75"
          >
            <DialogPanel
              class="flex w-full h-full lg:max-w-screen-md lg:items-stretch justify-center lg:w-auto relative lg:static lg:h-auto"
            >
              <div class="relative h-full w-full lg:w-fit lg:h-fit group">
                <div
                  class="hidden lg:dark:block absolute inset-0 bg-gradient-to-tr from-indigo-500 to-sky-500 rounded-3xl blur-xl opacity-25 translate-x-1 translate-y-1 lg:dark:group-hover:opacity-50 transition-all duration-1000 lg:dark:group-hover:duration-300"
                ></div>
                <div
                  class="w-full lg:w-[834PX] h-full bg-white dark:bg-gray-800 lg:h-auto lg:rounded-3xl relative lg:shadow-lg lg:dark:shadow-none p-4.5 flex flex-col shrink-0"
                >
                  <DialogTitle as="h3" class="text-base w-full flex justify-between items-center">
                    <div class="flex items-center gap-x-3">
                      <span class="bg-primary rounded-full p-2.5">
                        <Icon
                          name="edit"
                          class="w-4 h-4 !text-dark-800 dark:text-white cursor-pointer  box-content"
                        />
                      </span>
                      <div class="text-lg font-bold">
                        {{
                          form.type === 'edit'
                            ? $t('Talk.General.edit_announcement')
                            : $t('Talk.General.new_announcement')
                        }}
                      </div>
                    </div>

                    <div class="text-dark-300 dark:text-gray-400 flex items-center gap-x-2">
                      <Icon name="calendar_days" class="w-5 h-5" />
                      <span>{{ date }}</span>
                    </div>
                  </DialogTitle>

                  <div class="mt-4.5 h-full flex flex-col grow">
                    <input
                      type="text"
                      class="border-input font-bold"
                      :placeholder="$t('Talk.General.announcement_title')"
                      v-model="form.title"
                    />

                    <textarea
                      name=""
                      id=""
                      rows="10"
                      class="border-input mt-4 grow"
                      :placeholder="$t('Talk.General.announcement_content')"
                      v-model="form.content"
                    ></textarea>
                  </div>

                  <div class="mt-6 flex justify-end gap-x-4">
                    <button
                      class="main-border py-4 px-6 text-base font-bold"
                      @click="emit('close')"
                    >
                      {{ $t('Talk.General.cancel') }}
                    </button>
                    <button
                      class="main-border primary py-4 px-6 text-base font-bold"
                      :class="{
                        'faded still': !form.isFinished,
                      }"
                      :disabled="!form.isFinished"
                      @click="submit()"
                    >
                      {{
                        form.type === 'edit'
                          ? $t('Talk.General.update')
                          : $t('Talk.General.publish')
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { useCreateAnnouncementFormStore } from '@/stores/forms'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps<{
  show: boolean
  date: string
  communityId: string
}>()

const emit = defineEmits(['close', 'submit'])

const form = useCreateAnnouncementFormStore()

async function submit() {
  form.communityId = props.communityId
  await form.submit()

  emit('submit')
}
</script>

<style lang="scss" scoped>
.border-input {
  /* prettier-ignore */
  font-size: 16PX;
  &::placeholder {
    /* prettier-ignore */
    font-weight: normal;
  }

  --border-color: #303133;
  --faded-border-color: #bfc2cc;

  .dark & {
    background-color: #1f2937;
    --faded-border-color: #6b7280;
    --border-color: #d1d5db;
  }

  &:not(:active, :hover):placeholder-shown {
    --border-color: var(--faded-border-color);
  }

  outline: 0;
  /* prettier-ignore */
  border: 2PX solid var(--border-color);
  /* prettier-ignore */
  box-shadow: 3PX 3PX 0 var(--border-color);
  /* prettier-ignore */
  border-radius: 12PX;
  /* prettier-ignore */
  padding: 16PX;
  resize: none;
  transition-property: all;
  transition-duration: 200ms;
}
</style>
