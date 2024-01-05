export const convertQueryToRegex = ({query, exceptions}: {query: {}, exceptions: string[]}) => {
  return Object?.entries(query)
    ?.filter(([key]) => !exceptions.includes(key))
    ?.forEach(([key, value]) => {
      // @ts-ignore
      query[key] = new RegExp(value, "i");
    });
}

export const validEmailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const validPhoneNumberPatter = /^(\+98|0)?9\d{9}$/