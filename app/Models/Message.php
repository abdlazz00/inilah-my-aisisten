<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasUuids;
    protected $fillable = ['contact_id', 'role', 'content'];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
