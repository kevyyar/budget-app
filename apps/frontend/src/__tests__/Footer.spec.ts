import { describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'

const mockRoute = ref({ path: '/budget' })

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
}))

vi.mock('@/components/AddExpenseModal.vue', () => ({
  default: {
    name: 'AddExpenseModal',
    props: ['visible'],
    template: '<div class="add-expense-modal-mock" v-if="visible"></div>',
  },
}))

vi.mock('primevue/tabs', () => ({
  default: {
    name: 'Tabs',
    props: ['value'],
    template: '<div class="tabs-mock"><slot /></div>',
  },
}))

vi.mock('primevue/tablist', () => ({
  default: {
    name: 'TabList',
    template: '<div class="tablist-mock"><slot /></div>',
  },
}))

vi.mock('primevue/tab', () => ({
  default: {
    name: 'Tab',
    props: ['value'],
    template: '<div class="tab-mock" :data-value="value"><slot /></div>',
  },
}))

const createWrapper = (routePath = '/budget') => {
  mockRoute.value = { path: routePath }
  return mount(Footer, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

describe('Footer', () => {
  describe('rendering', () => {
    it('renders all navigation items', () => {
      const wrapper = createWrapper()
      const expectedLabels = ['Budget', 'Analytics', 'Add', 'Expenses', 'Settings']

      expectedLabels.forEach((label) => {
        expect(wrapper.text()).toContain(label)
      })
    })

    it('renders correct number of tabs', () => {
      const wrapper = createWrapper()
      const tabs = wrapper.findAll('.tab-mock')

      expect(tabs).toHaveLength(5)
    })

    it('renders router-links for navigation tabs and button for Add', () => {
      const wrapper = createWrapper()
      const links = wrapper.findAllComponents(RouterLinkStub)
      const addButton = wrapper.find('.add-btn')

      expect(links).toHaveLength(4)
      expect(addButton.exists()).toBe(true)
    })
  })

  describe('navigation routes', () => {
    const expectedRoutes = [
      { route: '/budget', label: 'Budget' },
      { route: '/analytics', label: 'Analytics' },
      { route: '/expenses', label: 'Expenses' },
      { route: '/settings', label: 'Settings' },
    ]

    it.each(expectedRoutes)('renders $label tab with route $route', ({ route, label }) => {
      const wrapper = createWrapper()
      const links = wrapper.findAllComponents(RouterLinkStub)
      const link = links.find((l) => l.props().to === route)

      expect(link).toBeDefined()
      expect(link?.text()).toContain(label)
    })

    it('renders Add as button (not router-link)', () => {
      const wrapper = createWrapper()
      const addButton = wrapper.find('.add-btn')

      expect(addButton.exists()).toBe(true)
      expect(addButton.text()).toContain('Add')
    })
  })

  describe('icons', () => {
    const expectedIcons = [
      { route: '/budget', icon: 'pi pi-wallet' },
      { route: '/analytics', icon: 'pi pi-chart-line' },
      { route: '/add', icon: 'pi pi-plus' },
      { route: '/expenses', icon: 'pi pi-inbox' },
      { route: '/settings', icon: 'pi pi-cog' },
    ]

    it.each(expectedIcons)('renders correct icon for $route', ({ icon }) => {
      const wrapper = createWrapper()
      const iconClasses = icon.split(' ')

      const iconElement = wrapper.find(`i.${iconClasses.join('.')}`)
      expect(iconElement.exists()).toBe(true)
    })

    it('applies special "add" class to Add button icon', () => {
      const wrapper = createWrapper()
      const addIcon = wrapper.find('i.add')

      expect(addIcon.exists()).toBe(true)
      expect(addIcon.classes()).toContain('pi')
      expect(addIcon.classes()).toContain('pi-plus')
    })

    it('does not apply "add" class to other icons', () => {
      const wrapper = createWrapper()
      const allIcons = wrapper.findAll('i')
      const iconsWithAddClass = allIcons.filter((i) => i.classes().includes('add'))

      expect(iconsWithAddClass).toHaveLength(1)
    })
  })

  describe('active route tracking', () => {
    it('passes current route to Tabs component', () => {
      const wrapper = createWrapper('/analytics')
      const tabs = wrapper.find('.tabs-mock')

      expect(tabs.exists()).toBe(true)
    })

    it.each(['/budget', '/analytics', '/add', '/expenses', '/settings'])(
      'tracks active state for route %s',
      (routePath) => {
        const wrapper = createWrapper(routePath)
        const tabsComponent = wrapper.findComponent({ name: 'Tabs' })

        expect(tabsComponent.props('value')).toBe(routePath)
      },
    )
  })

  describe('structure and styling', () => {
    it('wraps content in card container', () => {
      const wrapper = createWrapper()
      const card = wrapper.find('.card')

      expect(card.exists()).toBe(true)
    })

    it('each tab-item has correct structure', () => {
      const wrapper = createWrapper()
      const tabItems = wrapper.findAll('.tab-item')

      tabItems.forEach((item) => {
        expect(item.find('i').exists()).toBe(true)
        expect(item.find('.u-label').exists()).toBe(true)
      })
    })

    it('tab-items contain icon and label elements', () => {
      const wrapper = createWrapper()
      const firstTabItem = wrapper.find('.tab-item')

      const icon = firstTabItem.find('i')
      const label = firstTabItem.find('.u-label')

      expect(icon.exists()).toBe(true)
      expect(label.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('all links have text content', () => {
      const wrapper = createWrapper()
      const links = wrapper.findAllComponents(RouterLinkStub)

      links.forEach((link) => {
        expect(link.text().trim().length).toBeGreaterThan(0)
      })
    })

    it('tab order matches visual order', () => {
      const wrapper = createWrapper()
      const tabItems = wrapper.findAll('.tab-item')
      const expectedOrder = ['Budget', 'Analytics', 'Add', 'Expenses', 'Settings']

      tabItems.forEach((item, index) => {
        expect(item.text()).toContain(expectedOrder[index])
      })
    })
  })
})
