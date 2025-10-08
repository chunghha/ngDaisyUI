import { describe, expect, it } from 'vitest'
import { type AnyQueryKey, broaden, keyStartsWith, projectKeys, themeKeys, userKeys } from './query-keys'

describe('query-keys helpers', () => {
  describe('userKeys', () => {
    it('root returns stable literal tuple', () => {
      const a = userKeys.root()
      const b = userKeys.root()
      expect(a).toEqual(['user'])
      expect(a).toBeTypeOf('object') // tuple (readonly array)
      expect(a).toStrictEqual(b)
    })

    it('detail includes id as third segment', () => {
      const k = userKeys.detail('u1')
      expect(k).toEqual(['user', 'detail', 'u1'])
      expect(k[2]).toBe('u1')
    })

    it('list applies active filter or all fallback', () => {
      expect(userKeys.list()).toEqual(['user', 'list', 'all'])
      expect(userKeys.list({ active: true })).toEqual(['user', 'list', true])
      expect(userKeys.list({ active: false })).toEqual(['user', 'list', false])
    })

    it('preferences key structure', () => {
      const k = userKeys.preferences('u9')
      expect(k).toEqual(['user', 'preferences', 'u9'])
    })
  })

  describe('themeKeys', () => {
    it('root key', () => {
      expect(themeKeys.root()).toEqual(['theme'])
    })

    it('current key singleton', () => {
      const a = themeKeys.current()
      const b = themeKeys.current()
      expect(a).toEqual(['theme', 'current'])
      expect(a).toStrictEqual(b)
    })
  })

  describe('projectKeys', () => {
    it('list fallback and variants', () => {
      expect(projectKeys.list()).toEqual(['project', 'list', 'all'])
      expect(projectKeys.list('active')).toEqual(['project', 'list', 'active'])
      expect(projectKeys.list('archived')).toEqual(['project', 'list', 'archived'])
    })

    it('detail structure', () => {
      expect(projectKeys.detail('p42')).toEqual(['project', 'detail', 'p42'])
    })
  })

  describe('broadening & prefix checks', () => {
    it('keyStartsWith matches prefixes', () => {
      const full = userKeys.preferences('xyz')
      const prefix1: AnyQueryKey = ['user']
      const prefix2: AnyQueryKey = ['user', 'preferences']
      const wrong: AnyQueryKey = ['user', 'detail']
      expect(keyStartsWith(full, prefix1)).toBe(true)
      expect(keyStartsWith(full, prefix2)).toBe(true)
      expect(keyStartsWith(full, wrong)).toBe(false)
    })

    it('broaden returns truncated prefix tuples', () => {
      const full = userKeys.detail('abc')
      expect(full).toEqual(['user', 'detail', 'abc'])
      const prefix2 = broaden(full, 2)
      expect(prefix2).toEqual(['user', 'detail'])
      const prefix1 = broaden(full, 1)
      expect(prefix1).toEqual(['user'])
    })

    it('broaden does not mutate original key', () => {
      const full = projectKeys.list('active')
      const copyBefore = [...full]
      const prefix = broaden(full, 2)
      expect(prefix).toEqual(['project', 'list'])
      expect(full).toEqual(copyBefore) // original untouched
    })
  })

  describe('immutability / literal guarantees (runtime proxy)', () => {
    it('returned tuples are not the same reference when re-created', () => {
      const a = themeKeys.current()
      const b = themeKeys.current()
      // Intentionally not using referential equality; they are independent literals
      expect(a).toEqual(b)
      expect(a).not.toBe(b)
    })
  })

  describe('safety assertions', () => {
    it('no object segments present (primitive-only policy)', () => {
      const allKeys: AnyQueryKey[] = [
        userKeys.root(),
        userKeys.list(),
        userKeys.list({ active: true }),
        userKeys.detail('id1'),
        userKeys.preferences('id1'),
        themeKeys.root(),
        themeKeys.current(),
        projectKeys.root(),
        projectKeys.list(),
        projectKeys.detail('pid'),
      ]

      const isPrimitive = (v: unknown) => ['string', 'number', 'boolean'].includes(typeof v)

      for (const k of allKeys) {
        for (const seg of k) {
          expect(isPrimitive(seg)).toBe(true)
        }
      }
    })
  })
})
