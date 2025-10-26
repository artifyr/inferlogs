
import { blogPosts } from './src/data/posts';
import { supabaseUrl, supabaseKey } from './src/lib/supabaseClient';

const migrate = async () => {
  for (const post of blogPosts) {
    const { id, createdAt, updatedAt, ...postData } = post; // Exclude id from the post data
    const mappedPostData = {
      ...postData,
      created_at: createdAt,
      updated_at: updatedAt,
    };
    const response = await fetch(`${supabaseUrl}/rest/v1/posts`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(mappedPostData),
      }
    );

    if (response.ok) {
      console.log(`Successfully inserted post with title: ${post.title}`);
    } else {
      console.error(`Failed to insert post with title: ${post.title}`);
      console.error(await response.text());
    }
  }
};

migrate();
