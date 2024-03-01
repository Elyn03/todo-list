export interface Task {
   title: string,
   description: string,
   date: string,
   priority: string
   category: string | undefined
}

export interface Filter {
   priority: string
   date: string,
   category: string
}

export interface Category {
   title: string
}