import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetCard from '@/components/BudgetCard.vue'

const createWrapper = (props = {}) => {
  return mount(BudgetCard, {
    props: {
      income: 5000,
      spent: 2000,
      daysRemaining: 10,
      ...props,
    },
  })
}

describe('BudgetCard', () => {
  describe('remaining budget calculation', () => {
    it('calculates remaining = income - spent', () => {
      const wrapper = createWrapper({ income: 5000, spent: 2000 })
      expect(wrapper.text()).toContain('3,000.00')
    })

    it('handles negative remaining when overspent', () => {
      const wrapper = createWrapper({ income: 1000, spent: 1500 })
      expect(wrapper.text()).toContain('-500.00')
    })

    it('shows zero when income equals spent', () => {
      const wrapper = createWrapper({ income: 1000, spent: 1000 })
      expect(wrapper.text()).toContain('0.00')
    })
  })

  describe('spent percentage calculation', () => {
    it('calculates correct percentage', () => {
      const wrapper = createWrapper({ income: 1000, spent: 500 })
      const progressFill = wrapper.find('.progress-fill')
      expect(progressFill.attributes('style')).toContain('width: 50%')
    })

    it('caps at 100% when overspent', () => {
      const wrapper = createWrapper({ income: 1000, spent: 1500 })
      const progressFill = wrapper.find('.progress-fill')
      expect(progressFill.attributes('style')).toContain('width: 100%')
    })

    it('returns 0% when income is zero', () => {
      const wrapper = createWrapper({ income: 0, spent: 0 })
      const progressFill = wrapper.find('.progress-fill')
      expect(progressFill.attributes('style')).toContain('width: 0%')
    })
  })

  describe('daily budget calculation', () => {
    it('calculates daily budget = remaining / daysRemaining', () => {
      const wrapper = createWrapper({ income: 5000, spent: 2000, daysRemaining: 10 })
      expect(wrapper.text()).toContain('300.00')
    })

    it('returns full remaining when daysRemaining is 0', () => {
      const wrapper = createWrapper({ income: 5000, spent: 2000, daysRemaining: 0 })
      expect(wrapper.text()).toContain('3,000.00')
    })

    it('handles negative daily when overspent', () => {
      const wrapper = createWrapper({ income: 1000, spent: 1500, daysRemaining: 5 })
      expect(wrapper.text()).toContain('-100.00')
    })

    it('uses default daysRemaining of 4 when not provided', () => {
      const wrapper = mount(BudgetCard, {
        props: { income: 4000, spent: 0 },
      })
      expect(wrapper.text()).toContain('1,000.00')
    })
  })

  describe('formatting', () => {
    it('formats amounts with locale separators', () => {
      const wrapper = createWrapper({ income: 10000, spent: 5000 })
      expect(wrapper.text()).toContain('5,000.00')
    })

    it('shows spent and income labels', () => {
      const wrapper = createWrapper({ income: 5600, spent: 1905 })
      expect(wrapper.text()).toContain('$1,905 spent')
      expect(wrapper.text()).toContain('$5,600 income')
    })
  })

  describe('structure', () => {
    it('renders article with budget-card class', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('article.budget-card').exists()).toBe(true)
    })

    it('renders progress bar section', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.progress-bar').exists()).toBe(true)
      expect(wrapper.find('.progress-fill').exists()).toBe(true)
    })

    it('renders daily budget section', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.daily-budget').exists()).toBe(true)
      expect(wrapper.text()).toContain('Daily budget:')
    })
  })
})
