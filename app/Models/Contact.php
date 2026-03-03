<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasUuids;
    protected $fillable = ['name', 'phone_number','persona_id' ,'is_active','is_group' ,'last_interacted_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'last_interacted_at' => 'datetime',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
}
