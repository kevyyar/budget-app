import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import App from '../App.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/' }),
}))

vi.mock('primevue/tabs', () => ({
  default: { template: '<div><slot /></div>' },
}))

vi.mock('primevue/tablist', () => ({
  default: { template: '<div><slot /></div>' },
}))

vi.mock('primevue/tab', () => ({
  default: { template: '<div><slot /></div>' },
}))

describe('App', () => {
  it('renders footer navigation', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<div class="router-view-stub" />' },
          RouterLink: RouterLinkStub,
        },
      },
    })
    expect(wrapper.text()).toContain('Budget')
    expect(wrapper.text()).toContain('Settings')
  })
})
