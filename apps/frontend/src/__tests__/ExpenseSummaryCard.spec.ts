import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseSummaryCard from '@/components/ExpenseSummaryCard.vue'

const createWrapper = (props = {}) => {
  return mount(ExpenseSummaryCard, {
    props: {
      label: 'Variable',
      amount: 500,
      icon: 'pi pi-inbox',
      iconColor: '#ff6b6b',
      iconBg: 'rgba(255, 107, 107, 0.15)',
      ...props,
    },
  })
}

describe('ExpenseSummaryCard', () => {
  describe('rendering', () => {
    it('displays the label', () => {
      const wrapper = createWrapper({ label: 'Fixed' })
      expect(wrapper.text()).toContain('Fixed')
    })

    it('displays formatted amount with dollar sign', () => {
      const wrapper = createWrapper({ amount: 1500 })
      expect(wrapper.text()).toContain('$1,500')
    })

    it('formats large amounts with locale separators', () => {
      const wrapper = createWrapper({ amount: 12345 })
      expect(wrapper.text()).toContain('$12,345')
    })
  })

  describe('icon styling', () => {
    it('applies icon class', () => {
      const wrapper = createWrapper({ icon: 'pi pi-home' })
      const icon = wrapper.find('i')
      expect(icon.classes()).toContain('pi')
      expect(icon.classes()).toContain('pi-home')
    })

    it('applies icon background color', () => {
      const wrapper = createWrapper({ iconBg: 'rgba(124, 107, 255, 0.15)' })
      const iconWrap = wrapper.find('.icon-wrap')
      expect(iconWrap.attributes('style')).toContain('background-color: rgba(124, 107, 255, 0.15)')
    })

    it('applies icon color', () => {
      const wrapper = createWrapper({ iconColor: '#7c6bff' })
      const iconWrap = wrapper.find('.icon-wrap')
      expect(iconWrap.attributes('style')).toContain('color: rgb(124, 107, 255)')
    })
  })

  describe('structure', () => {
    it('renders article with expense-card class', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('article.expense-card').exists()).toBe(true)
    })

    it('renders icon wrapper', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.icon-wrap').exists()).toBe(true)
    })

    it('renders content section with label and amount', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.find('.label').exists()).toBe(true)
      expect(wrapper.find('.amount').exists()).toBe(true)
    })
  })
})
